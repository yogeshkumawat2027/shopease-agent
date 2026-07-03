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
* JavaScript (ES Modules)
* UUID

---

# Project Structure

```txt
shopease-agent
│
├── controllers
│   └── sessionController.js
│
├── services
│   ├── agent.service.js
│   ├── sessionService.js
│   ├── toolExecutor.js
│   └── groq.service.js
│
├── agents
│   ├── toolDetector.js
│   └── conversationFormatter.js
│
├── prompts
│   └── systemPrompt.js
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

# Installation

## Clone Repository

```bash
git https://github.com/yogeshkumawat2027/shopease-agent.git
cd shopease-agent
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file:

```env
PORT=5000
GROQ_API_KEY=YOUR_GROQ_API_KEY
MODEL=llama-3.3-70b-versatile
```

## Start Development Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:5000
```

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

---

# Supported Customer Queries

### FAQ Questions

* What is your return policy?
* Do you ship internationally?
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

Searches FAQ articles stored in `faqs.json`.

## 2. get_order_status

Retrieves order information from `orders.json`.

## 3. check_refund_eligibility

Determines whether an order qualifies for a refund.

## 4. escalate_to_human

Creates a support ticket and escalates the issue.

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

* MongoDB integration
* Redis session storage
* Authentication and user accounts
* Real-time chat using WebSockets
* Production deployment

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

