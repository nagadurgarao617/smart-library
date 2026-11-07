import os
import sys
from pathlib import Path
from datetime import datetime

# Add both current directory and parent directory to sys.path so it works from anywhere
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
for p in [str(current_dir), str(parent_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

try:
    from .database import engine, Base
    from .routes import auth, books, borrowing, students_admin
except ImportError:
    from database import engine, Base
    from routes import auth, books, borrowing, students_admin

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SVEC Smart Library - FastAPI Backend",
    description="Backend API for Smart Library Book Finder and Indoor Navigation System (Sri Vasavi Engineering College)",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router)
app.include_router(books.router)
app.include_router(borrowing.router)
app.include_router(students_admin.router)

# Health Check Endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "backend": "FastAPI (Python 3.14)",
        "database": "PostgreSQL (SmartLibrary)",
        "college": "Sri Vasavi Engineering College",
        "project": "Smart Library Book Finder and Indoor Navigation System",
        "timestamp": datetime.utcnow().isoformat()
    }

# ---------------- Frontend Static & SPA Routing ----------------
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
ASSETS_DIR = FRONTEND_DIST / "assets"

if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # If request is an API request that wasn't matched, return 404 JSON
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"error": f"API endpoint '/{full_path}' not found."})

    # If static file exists directly in frontend/dist (e.g. vite.svg, favicon)
    file_path = FRONTEND_DIST / full_path
    if file_path.is_file():
        return FileResponse(str(file_path))

    # SPA Fallback: serve index.html
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))

    return JSONResponse(
        status_code=200,
        content={"message": "SVEC Smart Library FastAPI backend running. Frontend dist not yet built."}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    print(f"Starting SVEC Smart Library FastAPI server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)

