import os
import asyncio
import json
import sys
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import langchain_huggingface
load_dotenv()


print("DEBUG ENV KEY =", os.environ.get("GOOGLE_API_KEY"))



# Set User-Agent at the very top to avoid warnings from loaders
os.environ["USER_AGENT"] = "MindEaseCompanion/1.0"

# Modern LangChain Imports (v0.2+)
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
# Prefer 'API_KEY' if set, fallback to 'GOOGLE_API_KEY'
GOOGLE_API_KEY = os.environ.get("API_KEY") or os.environ.get("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("\n" + "!"*60)
    print("CRITICAL NOTICE: NO API KEY DETECTED")
    print("Direct SDK calls from frontend will use injected environment.")
    print("Local RAG (Backend) will be restricted.")
    print("!"*60 + "\n")
else:
    # Set it for LangChain components
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Global State
db_client = None
users_collection = None
vectorstore = None
llm = None
rag_status = "initializing"

async def init_db():
    global db_client, users_collection
    try:
        db_client = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=1000)
        await db_client.admin.command('ping')
        users_collection = db_client.mindease.users
        print("✅ MongoDB: Connected")
    except Exception:
        print(f"ℹ️ MongoDB: Offline (Using frontend local storage fallback).")

RAG_ENABLED = os.environ.get("RAG_ENABLED", "true").lower() not in {"0", "false", "no"}
RAG_PDF_ENABLED = os.environ.get("RAG_PDF_ENABLED", "true").lower() not in {"0", "false", "no"}
RAG_WEB_ENABLED = os.environ.get("RAG_WEB_ENABLED", "false").lower() in {"1", "true", "yes"}
RAG_EMBEDDINGS_PROVIDER = os.environ.get("RAG_EMBEDDINGS_PROVIDER", "local").lower()
LOCAL_EMBEDDING_MODEL = os.environ.get(
    "LOCAL_EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

RAG_PERSIST_DIR = os.environ.get(
    "CHROMA_PERSIST_DIR",
    os.path.join(
        os.path.dirname(__file__),
        ".chroma_local" if RAG_EMBEDDINGS_PROVIDER != "google" else ".chroma_google"
    )
)
RAG_RETRY_BASE_SECONDS = int(os.environ.get("RAG_RETRY_BASE_SECONDS", "60"))
RAG_MAX_RETRIES = int(os.environ.get("RAG_MAX_RETRIES", "5"))

PDF_KNOWLEDGE_DIR = os.environ.get(
    "PDF_KNOWLEDGE_DIR",
    os.path.join(os.path.dirname(__file__), "knowledge")
)

# Sources for RAG
KNOWLEDGE_URLS = [
    "https://www.simplypsychology.org/mental-health.html"
]

def _is_quota_error(err: Exception) -> bool:
    msg = str(err)
    return "429" in msg or "RESOURCE_EXHAUSTED" in msg

def _persist_store_exists() -> bool:
    return os.path.exists(os.path.join(RAG_PERSIST_DIR, "chroma.sqlite3"))

def _get_embeddings():
    if RAG_EMBEDDINGS_PROVIDER == "google":
        if not GOOGLE_API_KEY:
            raise RuntimeError("GOOGLE_API_KEY not set for Google embeddings")
        return GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return HuggingFaceEmbeddings(model_name=LOCAL_EMBEDDING_MODEL)

def _format_source(doc: Document) -> str:
    src = doc.metadata.get("source") or doc.metadata.get("file_path") or ""
    if src.startswith("http"):
        host = urlparse(src).netloc
        return host or "web"
    if src:
        name = os.path.basename(src)
        page = doc.metadata.get("page")
        if page is not None:
            return f"{name} p.{int(page) + 1}"
        return name
    return "source"

def _ensure_text(value) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, bytes):
        return value.decode("utf-8", "ignore")
    if isinstance(value, list):
        return "".join(_ensure_text(item) for item in value)
    if isinstance(value, dict):
        if "text" in value:
            return _ensure_text(value.get("text"))
        return str(value)
    text_attr = getattr(value, "text", None)
    if text_attr is not None:
        return _ensure_text(text_attr)
    content_attr = getattr(value, "content", None)
    if content_attr is not None:
        return _ensure_text(content_attr)
    return str(value)

def _load_pdf_documents() -> List[Document]:
    if not RAG_PDF_ENABLED:
        return []
    if not os.path.isdir(PDF_KNOWLEDGE_DIR):
        return []
    pdf_paths = sorted(Path(PDF_KNOWLEDGE_DIR).glob("**/*.pdf"))
    if not pdf_paths:
        return []
    docs: List[Document] = []
    for path in pdf_paths:
        try:
            loader = PyPDFLoader(str(path))
            docs.extend(loader.load())
        except Exception as e:
            print(f"ℹ️ RAG: Failed to load PDF {path}: {e}")
    return docs

def _load_persisted_store():
    global vectorstore, rag_status
    if RAG_EMBEDDINGS_PROVIDER == "google" and not GOOGLE_API_KEY:
        rag_status = "offline"
        return False
    if not _persist_store_exists():
        return False
    try:
        embeddings = _get_embeddings()
        vectorstore = Chroma(
            persist_directory=RAG_PERSIST_DIR,
            embedding_function=embeddings,
            collection_name="mind_ease_knowledge"
        )
        rag_status = "ready"
        print("✅ RAG: Loaded persisted knowledge store")
        return True
    except Exception as e:
        print(f"ℹ️ RAG: Failed to load persisted store: {e}")
        return False

async def ingest_knowledge():
    global vectorstore, rag_status
    if not RAG_ENABLED:
        rag_status = "offline"
        print("ℹ️ RAG: Disabled via RAG_ENABLED=false")
        return
    if RAG_EMBEDDINGS_PROVIDER == "google" and not GOOGLE_API_KEY:
        rag_status = "offline"
        return

    os.makedirs(RAG_PERSIST_DIR, exist_ok=True)
    if _load_persisted_store():
        return

    attempt = 0
    while True:
        print("🧠 RAG: Ingesting knowledge baseline...")
        try:
            docs: List[Document] = []

            if RAG_PDF_ENABLED:
                docs.extend(_load_pdf_documents())

            if RAG_WEB_ENABLED and KNOWLEDGE_URLS:
                loader = WebBaseLoader(KNOWLEDGE_URLS)
                docs.extend(loader.load())

            if not docs:
                rag_status = "offline"
                print(f"ℹ️ RAG: No knowledge sources found in {PDF_KNOWLEDGE_DIR}")
                return

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            splits = text_splitter.split_documents(docs)

            embeddings = _get_embeddings()
            vectorstore = Chroma.from_documents(
                documents=splits, 
                embedding=embeddings, 
                collection_name="mind_ease_knowledge",
                persist_directory=RAG_PERSIST_DIR
            )
            try:
                vectorstore.persist()
            except Exception:
                pass
            rag_status = "ready"
            print(f"✅ RAG: Operational ({len(splits)} chunks ingested)")
            return
        except Exception as e:
            if _is_quota_error(e):
                rag_status = "quota_exceeded"
                if attempt >= RAG_MAX_RETRIES:
                    print("\n⚠️ RAG Notice: API Quota Limit (429) hit. Retry limit reached.")
                    return
                delay = min(RAG_RETRY_BASE_SECONDS * (2 ** attempt), 600)
                print(f"\n⚠️ RAG Notice: API Quota Limit (429) hit. Retrying in {delay}s.")
                attempt += 1
                await asyncio.sleep(delay)
                if _load_persisted_store():
                    return
                continue
            print(f"❌ RAG Error: {e}")
            rag_status = "error"
            return

@app.on_event("startup")
async def startup_event():
    global llm
    await init_db()
    if GOOGLE_API_KEY:
        try:
            llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", streaming=True)
            if RAG_ENABLED:
                if not _load_persisted_store():
                    # Run ingestion in background
                    asyncio.create_task(ingest_knowledge())
            else:
                rag_status = "offline"
        except Exception as e:
            print(f"❌ LLM Init Error: {e}")
    else:
        rag_status = "offline"

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "api_key_configured": bool(GOOGLE_API_KEY),
        "database": "connected" if users_collection is not None else "offline",
        "rag": rag_status
    }


@app.post("/chat/stream")
async def chat_stream(request: Request):
    if not llm:
        # Fallback for when backend is running but no key is set locally
        raise HTTPException(status_code=503, detail="AI Model not initialized on backend. Use frontend direct SDK.")
        
    data = await request.json()
    user_message = data.get("message")
    history = data.get("history", [])
    context = data.get("context", {})
    
    psych_context = ""
    source_notes: List[str] = []
    if vectorstore:
        try:
            relevant_docs = vectorstore.similarity_search(user_message, k=3)
            psych_context = "\n\n".join([doc.page_content for doc in relevant_docs])
            source_notes = sorted({ _format_source(doc) for doc in relevant_docs })
        except Exception:
            pass

    system_instruction = (
        f"You are MindEase Companion, an empathetic mental health support AI. "
        f"Your response style is {context.get('responseStyle', 'compassionate')}. "
        f"Incorporate this psychological knowledge if relevant: {psych_context}"
    )

    async def event_generator():
        messages = [SystemMessage(content=system_instruction)]
        # Keep context window manageable
        for msg in history[-8:]:
            if msg.get('role') == 'user':
                messages.append(HumanMessage(content=msg.get('content', '')))
            else:
                messages.append(SystemMessage(content=msg.get('content', '')))
        
        messages.append(HumanMessage(content=user_message))
        
        try:
            async for chunk in llm.astream(messages):
                content = _ensure_text(chunk)
                if content:
                    yield content
        except Exception as e:
            if "429" in str(e):
                yield "Quota limit (429) exceeded. Switching to fallback inference..."
            else:
                yield f"System error: {str(e)}"
        finally:
            if source_notes:
                footer = "\n\nSources: " + "; ".join(source_notes)
                yield footer

    return StreamingResponse(event_generator(), media_type="text/plain")

@app.post("/sync")
async def sync_user_data(request: Request):
    if users_collection is None:
        return {"status": "offline"}

    data = await request.json()
    email = data.get("profile", {}).get("email")
    if email:
        await users_collection.update_one(
            {"profile.email": email},
            {"$set": data},
            upsert=True
        )
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to ensure accessibility from frontend across possible local network configs
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
