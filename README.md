# ShopEase AI Customer Support API

An AI-powered customer support backend built with Node.js, Express, and Groq LLM. The API simulates a customer support agent that can answer FAQs, check order status, determine refund eligibility, and escalate issues to a human agent.

---

# Features

* AI-powered customer support agent using Groq
* Session-based conversations
* Chat history management
* FAQ knowledge base search
* Order status lookup
* Refund eligibility checking
* Human support escalation
* In-memory session management
* REST API architecture
* Modular and clean folder structure

---

# Tech Stack

* Node.js
* Express.js
* Groq API
* Hugging Face Transformers.js (Local Embeddings)
* JavaScript (ES Modules)
* UUID

---

# RAG Knowledge Base

This system implements a complete small-scale Retrieval-Augmented Generation (RAG) pipeline for semantic FAQ retrieval.

## How RAG Works

1. **User asks a question**
2. **Groq understands the intent** and decides to search the knowledge base
3. **Query embedding is generated** locally using Transformers.js
4. **FAQ article embeddings are searched** semantically using cosine similarity
5. **Top relevant FAQ articles** are returned as tool results
6. **Groq processes retrieved results** and generates the final response

## Architecture

- **Embedding Generation**: `services/embedding.service.js` - Uses Xenova/all-MiniLM-L6-v2 model running locally via Transformers.js
- **Semantic Search**: `services/rag.service.js` - Caches FAQ embeddings in memory, performs similarity matching
- **Knowledge Tool**: `tools/knowledge.tool.js` - Async tool that retrieves relevant FAQ articles using semantic search

## Key Features

- **Local Embeddings**: No external API calls needed. The embedding model runs on your machine.
- **Cached Index**: FAQ embeddings are generated once on server startup and cached in memory for fast retrieval.
- **Lazy Initialization**: The embedding model is downloaded and initialized only on first use.
- **Semantic Matching**: Finds relevant FAQs based on meaning, not just keyword matching.
- **Similarity Scoring**: Results are ranked by semantic relevance score.

## Performance Characteristics

- **First startup**: ~30-60 seconds (embedding model download and FAQ index building)
- **Subsequent queries**: <100ms for semantic search
- **Memory usage**: ~100-150MB for the cached embedding model and FAQ embeddings

## Limitations & Future Improvements

This implementation is optimized for small FAQ collections (up to ~1,000 articles). For larger knowledge bases:

- Migrate embeddings to PostgreSQL with pgvector extension
- Use vector database like Pinecone or Qdrant
- Implement batch query processing

---

# Project Structure

```txt
shopease-agent
│
├── controllers
│   └── sessionController.js
│
├── services
├     ── agents
│         ├── toolDetector.js
│         └── conversationFormatter.js
│
├   ── prompts
│        └── systemPrompt.js
│   ├── agent.service.js
│   ├── sessionService.js
│   ├── toolExecutor.js
│   └── groq.service.js
│

│
├── routes
│   └── sessionRoutes.js
│
├── tools
│   ├── knowledge.tool.js
│   ├── order.tool.js
│   ├── refund.tool.js
│   └── escalation.tool.js
│
├── data
│   ├── faqs.json
│   └── orders.json
│
├── server.js
├── .env
└── README.md
```

---

# Architecture
<img width="1819" height="703" alt="shopeaes" src="https://github.com/user-attachments/assets/d688e03e-b011-4776-85c9-40d25ff2a56b" />


```txt
Client
   ↓
Express Route
   ↓
Controller
   ↓
Session Service
   ↓
AI Agent Service
   ↓
Tool Detector
   ↓
Tool Executor
   ↓
Business Tools
   ↓
Groq LLM
   ↓
Final Response
```

---
# deployed url : https://shopease-agent.onrender.com

# Installation


## Clone Repository

```bash
git clone [https://github.com/yogeshkumawat2027/shopease-agent.git]
cd shopease-agent
```

## Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `@huggingface/transformers` for local embedding generation
- `groq-sdk` for LLM API calls
- Express.js for the HTTP server
- Vitest for running tests

## Create Environment Variables

Create a `.env` file:

```env
PORT=5000
GROQ_API_KEY=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
MODEL=llama-3.3-70b-versatile
```

## Start Development Server

```bash
nodemon server.js     or    node server.js
```

Server runs on:

```txt
http://localhost:5000

can use base url -->  https://shopease-agent.onrender.com/  (deployed)
```

## Run Tests

The test suite validates RAG semantic search behavior:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

### Test Coverage

- Semantic similarity for refund timing queries (FAQ-004)
- International shipping queries (FAQ-002)
- Account deletion queries (FAQ-012)
- Payment method queries (FAQ-006)
- Similarity score threshold enforcement
- Result field validation
- Error handling for empty/null queries
- Result limiting and sorting

---

# API Endpoints

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

---

# Create Session

```http
POST /api/sessions
```

Response:

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session-id"
    }
  }
}
```

---

# Send Message

```http
POST /api/sessions/:sessionId/chat
```

Body:

```json
{
  "message": "Where is my order ORD-1003?"
}
```

---

# Get Chat History

```http
GET /api/sessions/:sessionId/chat
```
<img width="1196" height="509" alt="image" src="https://github.com/user-attachments/assets/c1c6fcc3-d151-45aa-b941-2f680babbc99" />

<img width="1149" height="602" alt="image" src="https://github.com/user-attachments/assets/fb152da3-bf83-44f1-afde-f0b742dfb6d9" />


---

# Testing Semantic Retrieval

You can test the RAG semantic search through the session API:

## 1. Create a Session

```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "session": {
      "id": "session-uuid-here"
    }
  }
}
```

## 2. Test Semantic Query (e.g., Refund Timing)

Query using different words but same meaning:

```bash
curl -X POST http://localhost:5000/api/sessions/{sessionId}/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How soon will my money come back after returning the item?"
  }'
```

The agent will:
1. Recognize this as a FAQ question
2. Call `search_knowledge_base` with your query
3. RAG retrieves **FAQ-004** (refund processing time) based on semantic similarity
4. Groq generates a response using the retrieved FAQ content

## 3. Test International Shipping Query

```bash
curl -X POST http://localhost:5000/api/sessions/{sessionId}/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you send products outside the country?"
  }'
```

Retrieves **FAQ-002** (international shipping).

## 4. Test Account Deletion Query

```bash
curl -X POST http://localhost:5000/api/sessions/{sessionId}/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to permanently close my profile."
  }'
```

Retrieves **FAQ-012** (account deletion).

---

# Supported Customer Queries

### FAQ Questions (using Semantic RAG)

* "How soon will my money come back after returning the item?" → Retrieves FAQ-004
* "Can you send products outside the country?" → Retrieves FAQ-002
* "I want to permanently close my profile." → Retrieves FAQ-012
* "Which cards and digital wallets can I use?" → Retrieves FAQ-006
* What is your return policy?
* What payment methods do you accept?
* How can I contact support?

### Order Questions

* Where is my order ORD-1003?
* Track my order ORD-1001.

### Refund Questions

* Can I get a refund for ORD-1007?
* Is ORD-1006 eligible for refund?

### Human Escalation

* I want to talk to a human agent.
* Connect me to customer support.

---

# Tool System

The AI agent uses four tools:

## 1. search_knowledge_base

**Semantic FAQ retrieval using RAG.**

Retrieves relevant ShopEase policy and FAQ information for general questions about shipping, delivery, returns, refunds, cancellations, warranty, payments, accounts, and support.

- Uses semantic similarity to find relevant articles
- Results are ranked by relevance score
- Filters out low-relevance results below score threshold (default: 0.28)
- Returns top N matching articles (default: 3)

**When to use**: General policy or FAQ questions
**When NOT to use**: Order-specific queries (use get_order_status instead) or refund eligibility checks

## 2. get_order_status

Retrieves order information from `orders.json` including status, tracking number, estimated delivery, and items.

**When to use**: Check status of a specific order (e.g., "Where is my order ORD-1003?")

## 3. check_refund_eligibility

Determines whether an order qualifies for a refund based on order status and delivery date.

**When to use**: Check if a specific order is eligible for refund (e.g., "Can I get a refund for ORD-1007?")

## 4. escalate_to_human

Creates a support ticket and escalates the issue to a human agent.

**When to use**: When the AI cannot resolve the issue or the customer requests human support

---

# Session Management

Each conversation is stored in memory:

```txt
Session
 ├── id
 ├── createdAt
 ├── updatedAt
 └── messages[]
```

Every message contains:

```txt
id
role
content
createdAt
```

---

# Assumptions

* Sessions are stored in memory.
* No database persistence is implemented.
* Order and FAQ data are static JSON files.
* Authentication is not required.
* Human escalations are stored in memory.

---

# Future Improvements

* PostgreSQL with pgvector for larger knowledge bases
* Redis session storage for distributed systems
* Pinecone or Qdrant for production-scale vector search
* Authentication and user accounts
* Real-time chat using WebSockets
* Production deployment with monitoring

---

# Example Flow

```txt
User Message
      ↓
Controller
      ↓
Save User Message
      ↓
Detect Tool
      ↓
Execute Tool
      ↓
Get Tool Result
      ↓
Groq Generates Reply
      ↓
Save Assistant Message
      ↓
Return Response
```

---

# Author

Yogesh Kumawat

* GitHub: https://github.com/yogeshkumawat2027
* Email: [yogeshkumawat2027@gmail.com](mailto:yogeshkumawat2027@gmail.com)
