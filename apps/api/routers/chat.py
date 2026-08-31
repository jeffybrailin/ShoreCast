from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from agents.graph import get_graph, ShorecastState
import json
import logging
from typing import AsyncIterator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    agent_mode: str = "planner"
    beach_context: dict = {}


class ChatResponse(BaseModel):
    response: str
    session_id: str
    agent_mode: str


async def _stream_agent(request: ChatRequest) -> AsyncIterator[str]:
    graph = get_graph()
    state: ShorecastState = {
        "messages": [HumanMessage(content=request.message)],
        "agent_mode": request.agent_mode,
        "session_id": request.session_id,
        "beach_context": request.beach_context,
        "alert_triggered": False,
        "itinerary": {},
    }

    try:
        yield f"data: {json.dumps({'type': 'start', 'agent': request.agent_mode})}\n\n"

        async for event in graph.astream_events(state, version="v2"):
            event_name = event.get("event", "")

            if event_name == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content") and chunk.content:
                    yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

            elif event_name == "on_tool_start":
                tool_name = event.get("name", "")
                tool_input = event.get("data", {}).get("input", {})
                yield f"data: {json.dumps({'type': 'tool_start', 'tool': tool_name, 'input': str(tool_input)[:200]})}\n\n"

            elif event_name == "on_tool_end":
                tool_name = event.get("name", "")
                yield f"data: {json.dumps({'type': 'tool_end', 'tool': tool_name})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        logger.error(f"Agent stream error: {e}")
        yield f"data: {json.dumps({'type': 'token', 'content': f'Agent error: {str(e)}. Check GROQ_API_KEY in .env'})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        _stream_agent(request),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    graph = get_graph()
    state: ShorecastState = {
        "messages": [HumanMessage(content=request.message)],
        "agent_mode": request.agent_mode,
        "session_id": request.session_id,
        "beach_context": request.beach_context,
        "alert_triggered": False,
        "itinerary": {},
    }
    result = await graph.ainvoke(state)
    last_msg = result["messages"][-1]
    return ChatResponse(
        response=last_msg.content if hasattr(last_msg, "content") else str(last_msg),
        session_id=request.session_id,
        agent_mode=request.agent_mode,
    )
