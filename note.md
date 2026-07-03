# Backend Engineer — Take-Home Assignment

## What We're Looking For

We're not evaluating you on what you already know — skills can be learned. We're evaluating your **ability to learn something new under a deadline**, make decisions with incomplete information, and deliver something that works. In short: **agility, adaptability, and what you do under pressure.**

This assignment is built around that idea. You'll likely encounter things you haven't done before. That's intentional. Read docs, experiment, and ship what you can in the time available.

## Time & Deadline

- **Expected effort**: 8 hours
- **Do not exceed**: 12 hours
- **Submission deadline**: 48 hours from when you receive this

**Important:** If you run out of time, submit what you have. A working partial solution with honest notes about what's missing tells us more than a broken attempt to do everything. We read every submission knowing you worked under constraints.

## Scenario

You're building an **AI-powered customer support agent** for a fictional e-commerce company called **ShopEase**.

A customer sends a message like "Where is my order?" or "What's your return policy?" and your system responds with a helpful, accurate answer. Behind the scenes, an AI agent decides what information it needs, uses tools to fetch it, and synthesizes a response.

The agent can look up FAQs, check order status, and determine refund eligibility. When it genuinely can't help, it escalates to a human.

## What You'll Build

A single **Node.js service** that:

1. Exposes a REST API for customer chat
2. Runs an AI agent that calls an LLM and uses tools to answer questions
3. Manages conversation sessions so context carries across messages

Everything runs in one process. No databases, no Docker, no external services beyond the LLM API you choose.

### Architecture

```
Browser / curl
     │
     ▼
┌─────────────────────────────┐
│      Node.js Service         │
│                              │
│  POST /api/sessions          │  ← create a chat session
│  POST /api/sessions/:id/chat │  ← send a message, get agent reply
│  GET  /api/sessions/:id/chat │  ← get conversation history
│  GET  /health                │  ← health check
│                              │
│  ┌────────────────────────┐  │
│  │  Agent Loop             │  │
│  │  message → LLM →        │  │
│  │  tool call? → execute   │  │
│  │  → LLM → response       │  │
│  └────────────────────────┘  │
│                              │
│  Tools:                      │
│  • search_knowledge_base     │
│  • get_order_status          │
│  • check_refund_eligibility  │
│  • escalate_to_human         │
└─────────────────────────────┘
```

## Requirements

### 1. REST API

Three endpoints plus a health check:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/sessions` | Create a new chat session. Returns a session ID. |
| `POST` | `/api/sessions/:sessionId/chat` | Send a customer message. Returns the agent's reply. |
| `GET` | `/api/sessions/:sessionId/chat` | Returns all messages in this session (as an array, chronological). |
| `GET` | `/health` | Returns `{ status: "ok" }` if the service and LLM API are reachable. |

#### Error Handling

| Scenario | Expected |
|----------|----------|
| Empty message or missing field | `400` with a message saying what's wrong |
| Session ID doesn't exist | `404` with a descriptive message |
| LLM API is down or returns an error | `503` — respond with a friendly message like "I'm having trouble right now. Please try again." |
| Agent takes longer than 30 seconds | `504` with a timeout message |
| Unexpected internal error | `500` — must NOT expose stack traces or internal details |

#### Design Decisions You Make

We intentionally leave these open. There's no single right answer — we're looking at the choices you make and whether you can explain them:

- **Request/response shapes** — What does a message look like? What does the agent reply include?
- **Error response format** — Is it consistent across endpoints?
- **Session storage** — In-memory is perfectly fine. Don't overthink this.

### 2. AI Agent

Here's where you'll likely encounter something new. You need to build an agent loop that:

1. Receives a customer message (from the API layer)
2. Sends it to an LLM along with available tools and conversation history
3. If the LLM says "call a tool," you execute that tool, feed the result back to the LLM, and repeat
4. When the LLM responds with a final answer, return it to the customer

This is called **function calling** or **tool use**. Every major LLM provider supports it — OpenAI, Anthropic, Google Gemini all have Node.js SDKs with it built in. Pick whichever you're most comfortable with. You'll need to sign up for an API key (free tiers are sufficient).

**The 4 tools your agent can use:**

| Tool | What it does |
|------|-------------|
| `search_knowledge_base(query)` | Searches FAQ articles (provided in `data/faqs.json`) and returns matching results |
| `get_order_status(order_id)` | Looks up an order by ID in `data/orders.json` and returns status + details |
| `check_refund_eligibility(order_id)` | Checks if an order qualifies for a refund based on its state and delivery date |
| `escalate_to_human(summary, priority)` | Creates an escalation when the agent can't resolve the issue. Store in memory and include the ticket ID in the response. |

**You must handle:**
- Order ID not found → agent says "I couldn't find that order" — never makes something up
- A tool throws an error → agent recovers and still gives a useful response
- Questions outside the agent's scope (e.g., "What's the weather?") → handled politely

**You decide:**
- Which LLM provider to use
- What the system prompt says
- How tool definitions are structured
- How many retries / how deep the agent loop can go

**Never used an LLM API before?** Start with the [OpenAI function calling docs](https://platform.openai.com/docs/guides/function-calling) or [Anthropic tool use docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use). Both have clear examples. This part is meant to stretch you — it's okay if it's not perfect.

### 3. Mock Data

We provide two files in `data/`:

- **`faqs.json`** — 12 knowledge base articles (shipping, returns, refunds, cancellations, warranty, etc.)
- **`orders.json`** — 10 orders in various states (delivered, shipped, processing, cancelled, refunded)

These are the only files we provide. Everything else — project setup, config, error handling — is yours.

## Submission

Push to a **public GitHub repository** with:

1. Working Node.js service
2. `package.json` with dependencies
3. `.env.example` showing required environment variables (LLM API key, etc.)
4. **Real commit history** — not one giant commit. We want to see how you worked.

### README.md

Include these sections:

- **How to run** — exact steps. If we can't get it running in 5 minutes, we'll have trouble evaluating it.
- **Architecture** — a few sentences about how the pieces fit together
- **API docs** — each endpoint with a request and response example (curl commands are great)
- **What you chose and why** — framework, LLM provider. Was there a reason or just what you knew?
- **What you learned** — what was new for you in this assignment?
- **What's incomplete or rough** — be honest. If something doesn't work quite right, tell us. If you'd do something differently with more time, say what.
- **5-minute reflection** — one paragraph: what would you improve if you had another day?

## Evaluation

We score across five areas. But here's what that actually means in practice:

| Area | Weight | What we're really looking for |
|------|--------|------------------------------|
| **Agent orchestration** | 30% | Did you get the tool-calling loop to work? Does the agent pick the right tool for the job? Does it handle "order not found" without hallucinating? |
| **API design** | 25% | Are your endpoints RESTful? Are error responses consistent? Did you think about the person consuming your API? |
| **Prompt engineering** | 15% | Does your system prompt prevent hallucination? Are tool descriptions clear enough that the LLM uses the right one? |
| **Code clarity** | 15% | Can we navigate the code? Is it organized sensibly without being over-engineered for a 6-hour project? |
| **Communication** | 15% | Does your README honestly reflect what you built? Can you explain your choices? Is your self-assessment accurate? |

**We are not expecting production quality.** We're expecting a working prototype built by someone who was learning as they went. A candidate who submits a clean, working agent with 3 endpoints and honest documentation will score higher than one who attempts 10 endpoints and ships a broken mess.

After submission, we'll do a **45-minute live review**: walk through your code, discuss choices, and do a short design exercise (thinking only, no coding).

---

## FAQ

**Q: I've never used an LLM API before. Is that okay?**
Yes. Read the docs, get a free API key, follow the examples. The assignment is designed to be your first experience with this.

**Q: What if I can't finish everything?**
Submit what you have. Clearly mark what's incomplete. We'd rather see 3 working endpoints than 7 broken ones.

**Q: Can I use TypeScript?**
Yes. Use whatever you're comfortable with.

**Q: Which framework should I use?**
Express, Fastify, Hapi — whichever you prefer. If you don't have a preference, use Express (most docs, easiest to get help).

**Q: In-memory storage is really okay?**
Yes. No database setup required. Data resets on restart — that's fine.

**Q: Can I use AI coding assistants (ChatGPT, Copilot, Claude)?**
Yes. But in the live review, we'll ask you to explain your code. If you let an AI write something you don't understand, it will be obvious.

---

Good luck. If something is unclear, ask — asking good questions is part of what we're looking for.
