import os
import asyncio
import json
import sys
from typing import List, Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()


print("DEBUG ENV KEY =", os.environ.get("GOOGLE_API_KEY"))



# Set User-Agent at the very top to avoid warnings from loaders
os.environ["USER_AGENT"] = "MindEaseCompanion/1.0"

# Modern LangChain Imports (v0.2+)
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import WebBaseLoader
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

# Sources for RAG
KNOWLEDGE_URLS = [
    "https://www.simplypsychology.org/mental-health.html"
]

async def ingest_knowledge():
    global vectorstore, rag_status
    if not GOOGLE_API_KEY: 
        rag_status = "offline"
        return
    
    print("🧠 RAG: Ingesting knowledge baseline...")
    try:
        loader = WebBaseLoader(KNOWLEDGE_URLS)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        splits = text_splitter.split_documents(docs)
        
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
            vectorstore = Chroma.from_documents(
                documents=splits, 
                embedding=embeddings, 
                collection_name="mind_ease_knowledge"
            )
            rag_status = "ready"
            print(f"✅ RAG: Operational ({len(splits)} chunks ingested)")
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print("\n⚠️ RAG Notice: API Quota Limit (429) hit during ingestion.")
                rag_status = "quota_exceeded"
            else:
                print(f"❌ RAG Error: {e}")
                rag_status = "error"
                
    except Exception as e:
        print(f"❌ RAG System Error: {e}")
        rag_status = "error"

@app.on_event("startup")
async def startup_event():
    global llm
    await init_db()
    if GOOGLE_API_KEY:
        try:
            llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", streaming=True)
            # Run ingestion in background
            asyncio.create_task(ingest_knowledge())
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
    if vectorstore:
        try:
            relevant_docs = vectorstore.similarity_search(user_message, k=2)
            psych_context = "\n\n".join([doc.page_content for doc in relevant_docs])
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
                if chunk.content:
                    yield chunk.content
        except Exception as e:
            if "429" in str(e):
                yield "Quota limit (429) exceeded. Switching to fallback inference..."
            else:
                yield f"System error: {str(e)}"

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
