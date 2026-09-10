"""WebSocket Hub for real-time marine alerts."""
import asyncio, json, logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
router = APIRouter(tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self._connections: dict[str, WebSocket] = {}

    async def connect(self, session_id: str, ws: WebSocket):
        await ws.accept()
        self._connections[session_id] = ws
        logger.info(f"WS connected: {session_id} (total={len(self._connections)})")

    def disconnect(self, session_id: str):
        self._connections.pop(session_id, None)
        logger.info(f"WS disconnected: {session_id}")

    async def broadcast(self, message: dict):
        dead = []
        for sid, ws in self._connections.items():
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(sid)
        for sid in dead:
            self.disconnect(sid)

    async def send_to(self, session_id: str, message: dict):
        ws = self._connections.get(session_id)
        if ws:
            try: await ws.send_text(json.dumps(message))
            except Exception: self.disconnect(session_id)

manager = ConnectionManager()

async def broadcast_alert(message: dict):
    """Call from other modules to push alerts to all clients."""
    await manager.broadcast(message)

@router.websocket("/ws/alerts/{session_id}")
async def ws_alerts(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        # Send welcome ping
        await websocket.send_text(json.dumps({
            "type": "connected",
            "session_id": session_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "message": "Shorecast real-time alerts active",
        }))
        # Keep alive with periodic pings
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}))
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(session_id)
