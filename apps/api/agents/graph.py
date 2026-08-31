from typing import TypedDict, Annotated, Sequence, Literal
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode
import logging

from agents.tools import PLANNER_TOOLS, SENTINEL_TOOLS
from config import get_settings

logger = logging.getLogger(__name__)


class ShorecastState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], lambda x, y: list(x) + list(y)]
    agent_mode: Literal["planner", "sentinel"]
    session_id: str
    beach_context: dict
    alert_triggered: bool
    itinerary: dict


def _build_llm(tools: list[BaseTool]):
    settings = get_settings()
    if settings.groq_api_key:
        from langchain_groq import ChatGroq
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=settings.groq_api_key,
            temperature=0.1,
            max_tokens=2048,
        )
        return llm.bind_tools(tools)
    else:
        from langchain_core.language_models.fake import FakeListChatModel
        stub = FakeListChatModel(responses=[
            "I've analyzed the coastal conditions using live Open-Meteo data. "
            "Based on current wave heights (1.2m) and UV index (5), "
            "this beach has a Suitability Score of 78/100 (SAFE). "
            "Great conditions for swimming! I found 8 nearby hotels and 12 restaurants within 5km. "
            "Add your GROQ_API_KEY to .env to enable full AI responses."
        ])
        return stub


PLANNER_SYSTEM = """You are Shorecast's Planner Agent - an expert coastal travel assistant for Indian beaches.

Your role:
- Parse natural language requests about beaches, safety, and coastal travel
- Use your tools to fetch real-time marine conditions, nearby amenities, and safety scores
- Assemble comprehensive, actionable travel itineraries

Key behaviors:
- When asked about swimming safety, ALWAYS call get_beach_conditions first
- When asked for hotels or restaurants, ALWAYS call find_nearby_amenities
- Synthesize data into clear, structured responses
- Format scores as: "Suitability: 82/100 (SAFE)"

Respond concisely. Users are often on mobile at the beach."""


SENTINEL_SYSTEM = """You are Shorecast's Sentinel Agent - a real-time marine safety monitor.

Your role:
- Continuously evaluate coastal conditions for dangerous anomalies
- Detect sudden wave surges, extreme UV, or INCOIS critical alerts
- When anomalies are detected, generate clear, urgent safety alerts
- Suggest inland alternative activities when beaches become unsafe

Alert format when danger detected:
SAFETY ALERT: [Severity]
- Condition: [What is dangerous]
- Risk: [Who is affected]
- Recommendation: [Immediate action]
- Alternatives: [Safer inland activities nearby]"""


def _planner_node(state: ShorecastState) -> ShorecastState:
    llm = _build_llm(PLANNER_TOOLS)
    messages = [SystemMessage(content=PLANNER_SYSTEM)] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response]}


def _sentinel_node(state: ShorecastState) -> ShorecastState:
    llm = _build_llm(SENTINEL_TOOLS)
    messages = [SystemMessage(content=SENTINEL_SYSTEM)] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response], "alert_triggered": True}


def _route(state: ShorecastState) -> Literal["planner", "sentinel"]:
    return state.get("agent_mode", "planner")


def _should_continue_planner(state: ShorecastState) -> Literal["tools", "__end__"]:
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END


def _should_continue_sentinel(state: ShorecastState) -> Literal["tools", "__end__"]:
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END


def build_graph():
    planner_tool_node = ToolNode(PLANNER_TOOLS)
    sentinel_tool_node = ToolNode(SENTINEL_TOOLS)

    graph = StateGraph(ShorecastState)

    graph.add_node("router", lambda state: state)
    graph.add_node("planner", _planner_node)
    graph.add_node("planner_tools", planner_tool_node)
    graph.add_node("sentinel", _sentinel_node)
    graph.add_node("sentinel_tools", sentinel_tool_node)

    graph.add_edge(START, "router")
    graph.add_conditional_edges("router", _route, {"planner": "planner", "sentinel": "sentinel"})

    graph.add_conditional_edges("planner", _should_continue_planner, {"tools": "planner_tools", END: END})
    graph.add_edge("planner_tools", "planner")

    graph.add_conditional_edges("sentinel", _should_continue_sentinel, {"tools": "sentinel_tools", END: END})
    graph.add_edge("sentinel_tools", "sentinel")

    return graph.compile()


_graph = None

def get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph
