# 🚀 IdeaToPrototype: Concept to Live Prototype in 60 Seconds

> An autonomous multi-agent system that takes a single sentence idea and turns it into a fully designed, responsive, and deployed web application. Give it an app idea, Get back a link to a fully deployed app on Vercel!

IdeaToPrototype leverages **Google Gemini**, **Mastra.ai**, and the **Vercel API** to simulate an entire software development agency in your terminal. From market research to writing code and deploying to production, IdeaFlow handles it all without human intervention (except for a quick PM interview!).

---

## 🎥 Demo



---

## 🧠 How It Works

IdeaToPrototype orchestrates a pipeline of specialized AI agents, passing contextual data through a strict workflow:

1. **💡 Idea Processing**: The user inputs a raw app idea.
2. **🌐 Competitor Analysis**: The Agent searches the web in real-time to analyze market positioning and competitors.
3. **🧑‍💼 Product Manager Interview**: The PM Agent reviews the research and interviews the user in the terminal with 5 critical questions to define the MVP scope.
4. **🏗️ Architecture Design**: The Architect Agent generates a comprehensive Product Requirements Document (PRD) and designs the frontend architecture.
5. **💻 Code Generation**: The 10x Developer Agent writes the complete HTML/CSS codebase, enforcing premium UI/UX aesthetics, responsiveness, and clean code.
6. **🚀 Auto-Deployment**: The workflow bypasses local testing entirely by instantly deploying the generated codebase to **Vercel**, returning a live, shareable URL.

---

## 🛠️ Tech Stack

- **Framework**: [Mastra.ai](https://mastra.ai) (Agent Orchestration & Workflows)
- **AI Models**: Google Gemini
- **Deployment**: Vercel CLI & API
- **Generated Stack**: Pure HTML5 & Vanilla CSS (Zero-build-step architecture for 100% reliability)
- **Language**: TypeScript (Node.js)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ideaflow.git
cd ideaflow
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
GOOGLE_API_KEY=your_gemini_api_key
EXA_API_KEY=your_exa_search_api_key
VERCEL_TOKEN=your_vercel_access_token
```

### 3. Run the Magic
Execute the workflow script. The CLI will prompt you for your app idea.
```bash
npx tsx src/test-workflow.ts
```

### 4. Watch it Build
Sit back and watch the agents talk to each other in the terminal. In less than a minute, you'll be handed a `https://...vercel.app` link to your live prototype!

---
