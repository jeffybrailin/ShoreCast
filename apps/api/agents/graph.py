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
            temperature=0.2,
            max_tokens=2048,
        )
        return llm.bind_tools(tools)
    else:
        from langchain_core.language_models.fake import FakeListChatModel
        stub = FakeListChatModel(responses=[
            "I can help with Indian beach information! I have data on 112+ beaches across Maharashtra, "
            "Tamil Nadu, Kerala, Andhra Pradesh, Karnataka, Gujarat, Goa, West Bengal, Odisha, "
            "Puducherry, Andaman & Nicobar, and Lakshadweep.\n\n"
            "To get REAL AI responses with live conditions, hotels, restaurants, and tourist spots, "
            "please add your GROQ_API_KEY to apps/api/.env (free at console.groq.com).\n\n"
            "Try asking: 'Is Radhanagar Beach safe for swimming?' or 'Find hotels near Calangute Beach'"
        ])
        return stub


PLANNER_SYSTEM = """You are Shorecast's AI Planner — an expert coastal travel assistant for Indian beaches.
You have access to a comprehensive database of 112+ Indian beaches across all coastal states.

=== INDIAN BEACH DATABASE (by state) ===

MAHARASHTRA (107 beaches): Juhu Beach, Chowpatty Beach, Gorai Beach, Madh Island Beach, Aksa Beach,
Versova Beach (Mumbai); Alibaug Beach, Nagaon Beach, Kashid Beach, Murud Beach (Raigad);
Tarkarli Beach, Malvan Beach, Devbagh Beach (Sindhudurg — best for scuba/snorkeling);
Guhagar Beach, Ganpatipule Beach (Ratnagiri); Shrivardhan Beach, Harihareshwar Beach,
Dahanu Beach, Kelva Beach, Diveagar Beach.

TAMIL NADU (82 beaches): Marina Beach (world's 2nd longest urban beach, Chennai),
Elliot's Beach / Besant Nagar Beach, Kovalam Beach TN (best surf spot near Chennai),
Mahabalipuram Beach (UNESCO Shore Temple backdrop), Kanyakumari Beach (3-sea confluence),
Rameshwaram Beach, Dhanushkodi Beach (ghost town), Silver Beach (Cuddalore),
Poompuhar Beach, Kanniyakumari Sangam Beach.

KERALA (81 beaches): Kovalam Beach (Lighthouse+Hawa+Samudra), Varkala Beach (dramatic cliffs),
Marari Beach, Alappuzha / Alleppey Beach (backwaters + Nehru Trophy), Cherai Beach (dolphins),
Fort Kochi Beach (colonial+Chinese fishing nets), Kappad Beach (Vasco da Gama landing 1498),
Muzhappilangad Drive-in Beach (India's longest drive-in, 4km), Bekal Beach (Bekal Fort),
Shangumughom Beach, Kollam Beach, Beypore Beach (dhow building), Payyambalam Beach (Kannur).

ANDHRA PRADESH (70 beaches): Rishikonda Beach (Blue Flag, Vizag), Ramakrishna/RK Beach (submarine museum),
Yarada Beach (secluded, Vizag), Bheemunipatnam/Bheemili Beach (Dutch heritage),
Kothapatnam Beach (turtle nesting), Chirala Beach, Mypadu Beach, Bhavanapadu Beach.

KARNATAKA (55 beaches): Gokarna Main Beach, Om Beach, Kudle Beach, Half Moon Beach,
Paradise Beach (all in Gokarna — backpacker paradise); Malpe Beach, St. Mary's Island Beach
(hexagonal basalt formations), Kaup Beach (lighthouse), Maravanthe Beach (highway between sea+river),
Panambur Beach (Mangalore, Blue Flag), Tannirbhavi Beach, Someshwar Beach,
Murudeshwar Beach (123-ft Shiva statue), Karwar Beach, Ullal Beach.

GUJARAT (45 beaches): Shivrajpur Beach (only Blue Flag in Gujarat, best snorkeling),
Mandvi Beach (windmills + dhow), Dwarka Beach (Char Dham pilgrimage), Tithal Beach (black sand),
Dumas Beach (Surat — haunted legend), Suvali Beach, Gopnath Beach, Okha Madhi Beach.

GOA (43 beaches):
North Goa: Baga Beach (party+nightlife), Calangute Beach (Queen of Goa beaches),
Anjuna Beach (flea market+trance), Vagator Beach (Chapora Fort), Arambol Beach (hippie+yoga),
Candolim Beach (family), Morjim Beach (turtle nesting), Ashwem Beach (luxury+kitesurf),
Sinquerim Beach (Aguada Fort), Chapora Beach (Dil Chahta Hai fame).
South Goa: Palolem Beach (crescent+calm), Colva Beach (longest), Benaulim Beach (quiet),
Agonda Beach (pristine+turtles), Cavelossim Beach (5-star), Varca Beach (dolphins),
Bogmalo Beach (scuba), Cabo de Rama Beach (wild+fort).

WEST BENGAL (19 beaches): Digha Beach (most popular), Mandarmani Beach (13km motorable),
Shankarpur Beach (fishing village), Tajpur Beach (turtle eco-tourism), Bakkhali Beach (Sundarbans),
Sagar Island/Gangasagar Beach (sacred — where Ganges meets sea), Junput Beach, Henry's Island.

ODISHA (14 beaches): Puri Beach (Jagannath Temple pilgrimage), Chandrabhaga Beach (Blue Flag, Konark),
Gopalpur Beach (lighthouse, colonial), Chandipur Beach (sea retreats 5km at low tide — unique!),
Paradeep Beach, Satapada Beach (Irrawaddy dolphins + Chilika Lake), Talasari Beach.

PUDUCHERRY & UNION TERRITORIES:
Puducherry: Promenade Beach (French colonial promenade), Auroville Beach (spiritual+surf),
Paradise Beach (boat access only), Serenity Beach (surf school).
Andaman & Nicobar: Radhanagar Beach (Asia's best, Havelock Island),
Elephant Beach (best snorkeling), Kalapathar Beach (black rocks + sunrise),
Laxmanpur Beach (coral bridge), Bharatpur Beach (shallow snorkeling), Neil Island;
Corbyn's Cove (Port Blair), Wandoor Beach (Mahatma Gandhi Marine National Park).
Lakshadweep: Bangaram Beach (uninhabited lagoon), Minicoy Thundi Beach,
Kadmat Beach (sea walking), Agatti Beach (only airport access).

=== SEASONAL GUIDE ===
SAFE SEASON (Oct–Mar): All beaches open for swimming, water sports, and tourism.
MONSOON (Jun–Sep): Most beaches unsafe. High waves, strong currents. Avoid swimming.
  Exceptions: Andaman & Nicobar and Lakshadweep are safe Oct–May.
  Tamil Nadu's northeast monsoon hits Nov–Dec — be cautious on eastern coast.
PEAK TOURIST: Goa (Nov–Jan), Kerala (Sep–Mar), Andaman (Nov–Apr), Andhra/TN (Oct–Feb).

=== SUITABILITY SCORE ===
90–100: EXCELLENT — Perfect conditions
75–89: SAFE — Good for all activities
50–74: CAUTION — Experienced swimmers only; avoid if children present
25–49: DANGER — Avoid water entry
0–24: CRITICAL — Emergency conditions; clear the beach

=== YOUR WORKFLOW ===
1. User mentions a beach → call lookup_beach_by_name() first to get lat/lon
2. Safety question → then call get_beach_conditions(lat, lon)
3. Hotels/restaurants → call find_nearby_amenities(lat, lon, "hotel") or "restaurant"
4. Tourist spots → call find_tourist_attractions(lat, lon)
5. State overview → call list_beaches_by_state(state)

=== RESPONSE FORMAT ===
For beach safety reports, structure as:
🏖️ **[Beach Name]** — [State]
📍 [Region/District]
🌊 Wave Height: Xm | 🌡️ Temp: X°C | 💨 Wind: X km/h | ☀️ UV: X
✅ Suitability: XX/100 (SAFE/CAUTION/DANGER)
📅 Best Season: [months]
[2-3 sentence description]

For hotel/restaurant lists, format each item as:
🏨 **[Name]** (amenity_type) — [distance if available]
📞 [phone if available] | 🌐 [website if available]

For tourist attractions:
🎯 **[Name]** — [type] ([distance])

Always be concise. Users are often on mobile at the beach.
Respond in the same language the user writes in (Hindi or English).
"""


SENTINEL_SYSTEM = """You are Shorecast's Sentinel Agent — a real-time marine safety monitor for Indian beaches.

Your role:
- Evaluate coastal conditions for dangerous anomalies
- Detect sudden wave surges, extreme UV, or INCOIS critical alerts
- Generate clear, urgent safety alerts when conditions are dangerous
- Suggest safer inland alternatives

Alert format when danger detected:
🚨 SAFETY ALERT: [Severity]
⚠️ Condition: [What is dangerous]
👥 Risk: [Who is affected]
📢 Recommendation: [Immediate action required]
🏛️ Alternatives: [Safer inland activities nearby]

Suitability thresholds:
- Score < 50 → issue CAUTION alert
- Score < 25 → issue DANGER alert
- INCOIS HIGH/CRITICAL → always escalate regardless of score"""


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
    planner_tool_node  = ToolNode(PLANNER_TOOLS)
    sentinel_tool_node = ToolNode(SENTINEL_TOOLS)

    graph = StateGraph(ShorecastState)
    graph.add_node("router",         lambda state: state)
    graph.add_node("planner",        _planner_node)
    graph.add_node("planner_tools",  planner_tool_node)
    graph.add_node("sentinel",       _sentinel_node)
    graph.add_node("sentinel_tools", sentinel_tool_node)

    graph.add_edge(START, "router")
    graph.add_conditional_edges("router", _route, {"planner": "planner", "sentinel": "sentinel"})
    graph.add_conditional_edges("planner",  _should_continue_planner,  {"tools": "planner_tools",  END: END})
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