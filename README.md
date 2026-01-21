
# 🤖 Jarvis AI Assistant

**Enterprise-Ready AI Assistant using Retrieval-Augmented Generation (RAG)**

Jarvis is a full-stack AI assistant designed with an enterprise mindset. It combines semantic vector search with large language models to deliver accurate, context-aware responses through a modern chat interface.

This project demonstrates real-world AI system design principles used in production-grade SaaS platforms.

---

## 🌟 Overview

Jarvis follows a **Retrieval-Augmented Generation (RAG)** architecture:

- User queries are semantically understood using embeddings
- Relevant context is retrieved from a vector database
- A large language model generates grounded responses
- Results are presented through a clean, intuitive UI

The system is modular, scalable, and easy to extend.

---

## ✨ Key Features

- Conversational AI assistant (chatbot interface)
- Semantic search using vector embeddings
- Context-aware response generation (RAG)
- Knowledge base visualization with relevance scores
- Chat history and export functionality
- Modular backend supporting multiple LLM providers

---

## 🛠️ Technology Stack

### Backend
- Python 3.8+
- FastAPI
- Pinecone (Vector Database)
- SentenceTransformers (Embeddings)
- Anthropic Claude (LLM)
- Uvicorn (ASGI Server)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

---

## 🏗️ System Architecture

```
User
 ↓
React Chat Interface
 ↓
FastAPI Backend
 ↓
Sentence Transformer (Embeddings)
 ↓
Pinecone Vector Database
 ↓
Relevant Context
 ↓
Claude LLM
 ↓
Final Response
```

---

## 🔁 How It Works (RAG Flow)

1. User submits a query through the UI
2. Backend converts the query into vector embeddings
3. Pinecone retrieves the most relevant documents
4. Retrieved context is injected into the LLM prompt
5. The LLM generates a grounded, contextual answer
6. Response and sources are returned to the frontend

---

## 🚀 API Endpoints

### Health Check
`GET /`

### Query Assistant
`POST /query`
```json
{
  "question": "What is your refund policy?",
  "top_k": 3
}
```

### Add Documents
`POST /upsert`

### Knowledge Base Statistics
`GET /stats`

Swagger UI:
http://localhost:8000/docs

---

## ⚙️ Setup Instructions

### Backend

```bash
pip install fastapi uvicorn pinecone-client sentence-transformers anthropic
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🔐 Configuration

The application requires the following API keys:

- Pinecone API Key
- Anthropic API Key

These are configured directly in the backend configuration file.

---

## 🚧 Current Limitations

- File upload is UI-level only (no backend ingestion yet)
- No authentication or user management
- Chat history is not persisted
- LLM is API-based (not self-hosted)

---

## 🔮 Future Enhancements

- Support for self-hosted LLMs (Ollama / LLaMA)
- Real document ingestion (PDF, DOCX)
- Persistent chat history storage
- Authentication and role-based access
- Voice input and output

---

## 👩‍💻 Author

**Gayathri Maddala**  
B.Tech – Computer Science  
Woxsen University  

---

## 📌 Professional Note

This project reflects:
- Strong understanding of RAG-based AI systems
- Practical use of vector databases
- Clean API-driven backend design
- Full-stack AI application development

Suitable for enterprise demos, internships, and interviews.
