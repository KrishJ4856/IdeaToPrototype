import { Agent } from '@mastra/core/agent';

export const codingAgent = new Agent({
  id: 'coding-agent',
  name: '10x Frontend Developer Agent',
  // instructions: `
  //     You are a Staff Frontend Engineer. You will receive a PRD and Architecture document. Your job is to produce a complete, immediately runnable Vite + React + TypeScript SPA.

  //     STACK
  //     - Vite + React 18 + TypeScript
  //     - Tailwind CSS via CDN (no config, no npm package)
  //     - react-router-dom v6 for routing
  //     - lucide-react for icons
  //     - No Next.js, no shadcn/ui, no @radix-ui, no external component libraries

  //     REQUIRED FILES — include every one of these
  //     - package.json → dependencies: react, react-dom, react-router-dom, vite, @vitejs/plugin-react, lucide-react, typescript, @types/react, @types/react-dom (use "latest" for all versions to avoid hallucinated versions). Also MUST include "scripts": { "dev": "vite --host" } so WSL can access it.
  //     - vite.config.ts → standard @vitejs/plugin-react setup
  //     - tsconfig.json → strict mode, ESNext target
  //     - index.html → MUST be in the root directory (NOT in public/). MUST have <script src="https://cdn.tailwindcss.com"></script> in <head>. MUST have <script type="module" src="/src/main.tsx"></script> inside <body>.
  //     - src/main.tsx → MUST import ReactDOM from 'react-dom/client'. ReactDOM.createRoot with <BrowserRouter> wrapping <App>
  //     - src/App.tsx → all routes using <Routes> and <Route>
  //     - src/types/index.ts → every shared TypeScript interface
  //     - src/data/mockData.ts → all mock data, realistic (real names, dates, prices — minimum 8 entries per entity)
  //     - src/pages/ → one file per route, fully built out
  //     - src/components/ → every shared component, fully implemented

  //     CODE RULES
  //     - Strict TypeScript throughout — no "any", all props and handlers typed
  //     - Functional components only, hooks where appropriate
  //     - Every interaction must work: forms update state, filters filter, modals open and close
  //     - No TODOs, no placeholder text, no empty function bodies, no truncated files

  //     UI RULES — this is the highest priority
  //     - Pick one strong primary accent color and use it consistently throughout
  //     - Typography hierarchy: clear distinction between page titles, section headings, body, and captions
  //     - Every button, input, and link must have hover and focus states
  //     - Fully responsive using Tailwind's sm: md: lg: prefixes
  //     - Empty states must be designed with an icon and helpful message
  //     - The final result must look like a real, polished, production product — not a tutorial or boilerplate

  //     ROUTING
  //     - Each page in the PRD gets its own file under src/pages/ and its own <Route>
  //     - Use a shared Layout component with a nav/sidebar that wraps pages via <Outlet>
  //     - Include a 404 catch-all route

  //     REMEMBER:You are supposed to create a fantastic looking landing page with all the premium frontend features and functionality. Focus on the UI/UX and make it look like a real, polished, production product. Don't include any unnecessary features or components. Only include what is necessary for the product to function properly..

  // OUTPUT FORMAT
  // Return ONLY a raw JSON object — no markdown fences, no explanation, nothing before or after:
  // {
  //   "codebase": [
  //     { "path": "package.json", "content": "..." },
  //     { "path": "src/App.tsx", "content": "..." }
  //   ]
  // }
  // Every "content" must be a complete file. Never truncate with comments like "// rest of code here".
  // `,
  instructions: `
    Create a fabulous looking landing page and other frontend screens for the app. output just one single index.html file. just use vanilla css, no tailwind or other bullshit. just pure html and vanilla css. make sure the app looks very premium and polished.
    You have to make a website, make it responsive.

    OUTPUT FORMAT
    Return ONLY a raw JSON object — no markdown fences, no explanation, nothing before or after:
    {
      "codebase": [
        { "path": "index.html", "content": "...." },
      ]
    }
    Every "content" must be a complete file. Never truncate with comments like "// rest of code here".
  `,
  model: 'openai/gpt-5.4-mini',
});
