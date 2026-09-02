import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

for p in [parent_dir, current_dir, os.getcwd(), "/var/task"]:
    if p and os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.main import app
except Exception as e:
    # Fallback minimal app in extreme import failure to prevent FUNCTION_INVOCATION_FAILED
    from fastapi import FastAPI
    app = FastAPI(title="CUSWAY Fallback API")
    @app.get("/api/health")
    def health():
        return {"status": "fallback", "error": str(e)}

