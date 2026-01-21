"""
Jarvis AI Assistant - Complete Backend Implementation
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
from typing import List, Optional
import anthropic

# ============================================
# CONFIGURATION
# ============================================

# Initialize FastAPI
app = FastAPI(title="Jarvis AI Assistant", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Pinecone
PINECONE_API_KEY = "your-pinecone-api-key"  # Replace with your key
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("quickstart")  # Your existing index

# Initialize embedding model (runs locally)
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize LLM - Choose one option below:

# Option 1: Anthropic Claude (Recommended)
ANTHROPIC_API_KEY = "your-anthropic-api-key"  # Get from console.anthropic.com
anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# Option 2: OpenAI (Alternative)
# import openai
# OPENAI_API_KEY = "your-openai-api-key"
# openai.api_key = OPENAI_API_KEY

# Option 3: Local Ollama (Free)
# import requests
# OLLAMA_URL = "http://localhost:11434/api/generate"


# ============================================
# DATA MODELS
# ============================================

class Query(BaseModel):
    question: str
    top_k: Optional[int] = 3

class Document(BaseModel):
    text: str
    metadata: Optional[dict] = {}

class QueryResponse(BaseModel):
    response: str
    sources: List[dict]
    context_used: str


# ============================================
# HELPER FUNCTIONS
# ============================================

def generate_embedding(text: str) -> List[float]:
    """Generate embedding vector for text"""
    embedding = embedder.encode(text)
    return embedding.tolist()


def search_knowledge_base(query: str, top_k: int = 3) -> tuple:
    """Search Pinecone for relevant documents"""
    query_embedding = generate_embedding(query)
    
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    # Extract context and sources
    sources = []
    context_parts = []
    
    for match in results.matches:
        sources.append({
            "id": match.id,
            "score": match.score,
            "text": match.metadata.get('text', ''),
            "metadata": match.metadata
        })
        context_parts.append(match.metadata.get('text', ''))
    
    context = "\n\n".join(context_parts)
    return context, sources


def generate_response_claude(question: str, context: str) -> str:
    """Generate response using Anthropic Claude"""
    prompt = f"""You are a helpful AI assistant. Use the following context to answer the user's question accurately and concisely.

Context:
{context}

Question: {question}

Provide a clear, helpful answer based on the context provided. If the context doesn't contain relevant information, say so politely."""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )
    
    return message.content[0].text


def generate_response_openai(question: str, context: str) -> str:
    """Generate response using OpenAI (Alternative)"""
    # Uncomment if using OpenAI
    # response = openai.ChatCompletion.create(
    #     model="gpt-4",
    #     messages=[
    #         {"role": "system", "content": "You are a helpful AI assistant."},
    #         {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
    #     ]
    # )
    # return response.choices[0].message.content
    pass


def generate_response_ollama(question: str, context: str) -> str:
    """Generate response using local Ollama (Free)"""
    # Uncomment if using Ollama
    # import requests
    # prompt = f"Context: {context}\n\nQuestion: {question}"
    # response = requests.post(
    #     "http://localhost:11434/api/generate",
    #     json={"model": "llama2", "prompt": prompt, "stream": False}
    # )
    # return response.json()['response']
    pass


# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Jarvis AI Assistant API is running",
        "version": "1.0.0"
    }


@app.post("/query", response_model=QueryResponse)
async def query_assistant(query: Query):
    """
    Main endpoint for querying the AI assistant
    
    Flow:
    1. Generate embedding for user question
    2. Search Pinecone for relevant context
    3. Generate response using LLM with context
    4. Return response with sources
    """
    try:
        # Step 1 & 2: Search knowledge base
        context, sources = search_knowledge_base(query.question, query.top_k)
        
        if not context:
            return QueryResponse(
                response="I couldn't find relevant information to answer your question.",
                sources=[],
                context_used=""
            )
        
        # Step 3: Generate response with LLM
        response = generate_response_claude(query.question, context)
        
        return QueryResponse(
            response=response,
            sources=sources,
            context_used=context
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upsert")
async def upsert_documents(documents: List[Document]):
    """
    Add new documents to the knowledge base
    
    Example usage:
    POST /upsert
    [
        {
            "text": "Our support team is available 24/7",
            "metadata": {"category": "support"}
        }
    ]
    """
    try:
        vectors = []
        
        for i, doc in enumerate(documents):
            embedding = generate_embedding(doc.text)
            
            vectors.append({
                "id": f"doc_{i}_{hash(doc.text)}",
                "values": embedding,
                "metadata": {
                    "text": doc.text,
                    **doc.metadata
                }
            })
        
        index.upsert(vectors=vectors)
        
        return {
            "status": "success",
            "documents_added": len(documents)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats")
async def get_stats():
    """Get knowledge base statistics"""
    try:
        stats = index.describe_index_stats()
        return {
            "total_vectors": stats.total_vector_count,
            "dimension": stats.dimension,
            "index_fullness": stats.index_fullness
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# STARTUP: ADD SAMPLE DATA
# ============================================

@app.on_event("startup")
async def startup_event():
    """Initialize knowledge base with sample data on startup"""
    print("🚀 Starting Jarvis AI Assistant...")
    
    # Sample documents to add to knowledge base
    sample_docs = [
        {
            "text": "Our company offers 24/7 customer support via email at support@company.com and live chat on our website.",
            "metadata": {"category": "support", "topic": "contact"}
        },
        {
            "text": "We provide a 30-day money-back guarantee on all products. No questions asked.",
            "metadata": {"category": "billing", "topic": "refund"}
        },
        {
            "text": "Our premium plan includes unlimited API calls, priority support, advanced analytics, and dedicated account manager.",
            "metadata": {"category": "features", "topic": "premium"}
        },
        {
            "text": "Data security is our top priority. We use end-to-end encryption, regular security audits, and comply with SOC 2 and GDPR standards.",
            "metadata": {"category": "security", "topic": "compliance"}
        }
    ]
    
    try:
        # Check if index already has data
        stats = index.describe_index_stats()
        
        if stats.total_vector_count == 0:
            print("📚 Adding sample documents to knowledge base...")
            
            vectors = []
            for i, doc in enumerate(sample_docs):
                embedding = generate_embedding(doc["text"])
                vectors.append({
                    "id": f"sample_{i}",
                    "values": embedding,
                    "metadata": doc["metadata"] | {"text": doc["text"]}
                })
            
            index.upsert(vectors=vectors)
            print(f"✅ Added {len(sample_docs)} sample documents")
        else:
            print(f"✅ Knowledge base already contains {stats.total_vector_count} documents")
            
    except Exception as e:
        print(f"⚠️  Error during startup: {e}")
    
    print("🎉 Jarvis is ready to assist!")


# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
