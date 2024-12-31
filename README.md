# DCC MVP Architecture Overview

This markdown file outlines the high-level architecture of the **Dental Coaching Collective (DCC)** MVP. The MVP includes:

1. **Live Coaching (Front of Paywall)**
2. **AI Auto-Coaching & Resource Library (Behind Paywall)**
3. **Mocked Payment Flow (Stripe)**
4. **AI Chatbot (Hardcoded Retrieval)**
5. **Optional Future Integrations** (e.g., Google Meet API for live sessions, Notta AI for transcripts)

---

## Tech Stack

- **Next.js**:  
  - Front-end framework (React-based)  
  - Deployed on [Vercel](https://vercel.com/) for rapid continuous deployment
  
- **Supabase**:  
  - Database (PostgreSQL)  
  - Authentication for user sign-up/login  
  - Real-time APIs and easy integration with Next.js
  
- **Prisma**:  
  - ORM layer, type-safe queries, and schema migrations

- **Stripe (Mocked for MVP)**:  
  - Payment and subscription management  
  - In the MVP, display a mock checkout flow to illustrate feasibility

- **GPT-4o-mini (Mocked RAG)**:  
  - AI model for chatbot responses (can substitute GPT-3.5 or GPT-4 as needed)  
  - Hardcoded transcripts or Q&A pairs to emulate retrieval

- **Notta AI** (optional for demo data):  
  - Generate transcripts from meetings or videos that can be used in the Resource Library

- **Google Meet API** (future):  
  - Potential integration for live video sessions and scheduling

---

## System Architecture

Below is a high-level diagram showing how each component of the MVP connects:

```mermaid
graph LR
    A[User] --> |1. Visit Site| B[Next.js on Vercel]
    B --> |2. Auth Requests| C[Supabase Auth]
    B --> |3. DB Queries via Prisma| D[(Supabase DB)]
    B --> |4. Payment Actions Mock| E[Stripe Mocked]
    B --> |5. AI Queries| F[GPT-4o-mini]
    B --> |6. Resource Data| D
    B --> |7. Potential Video| G[Google Meet API]
    B --> |Optional Transcripts| H[Notta AI]

    style B fill:#286DA8,stroke:#fff,stroke-width:2px
    style C fill:#42BFDD,stroke:#fff,stroke-width:2px
    style D fill:#BADA55,stroke:#fff,stroke-width:2px
    style E fill:#7B7B7B,stroke:#fff,stroke-width:2px
    style F fill:#F47174,stroke:#fff,stroke-width:2px
    style G fill:#C892FF,stroke:#fff,stroke-width:2px
    style H fill:#FCD34D,stroke:#fff,stroke-width:2px
```

## User Flow

```mermaid
graph TD
    A[Visitor] --> B[Landing Page]
    B --> C[Coach Directory]
    C --> D[Book Session Mock]
    D --> X[Confirmation Screen]

    B --> E[Login/Sign-up]
    E --> F[Paywall Check]
    F --> G{Subscription Status?}
    G --> |YES| H[Resource Library & AI Chat]
    G --> |NO| I[Upgrade Prompt]

    H --> J[Chat with GPT-4o-mini]
    J --> K[AI Response Hardcoded RAG]

    style B fill:#dfe3e6,stroke:#000,stroke-width:1px
    style F fill:#ffc107,stroke:#000,stroke-width:1px
    style H fill:#8bc34a,stroke:#000,stroke-width:1px
    style J fill:#e1f7d5,stroke:#000,stroke-width:1px
```

## Flow Description

1. **Landing Page**: Public marketing page with overview of DCC
2. **Coach Directory**: Public page listing available coaches (front-of-paywall)
3. **Mock Booking**: User selects a time; payment is mocked for the MVP
4. **Login/Sign-up**: Required to access premium (AI & Resources)
5. **Paywall Check**: System checks subscriptionStatus in Supabase
6. **If Subscribed**: Access the Resource Library and AI Chat
7. **If Not Subscribed**: Prompt user to "Upgrade" (mock Stripe flow)
8. **AI Chat**: GPT-4o-mini (or GPT-3.5/4) returns answers referencing hardcoded transcripts or docs