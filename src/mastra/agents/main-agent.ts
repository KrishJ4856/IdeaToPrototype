import { Agent } from '@mastra/core/agent';

export const mainAgent = new Agent({
  id: 'main-agent',
  name: 'Main Agent',
  instructions: `
      You are the Main Agent of the Idea-to-Prototype system.
      Your task is to take a raw user idea for a product or service and extract its core components.
      You should identify the core concept, the target audience, and the primary goal of the idea.
      Keep your response structured and concise.
  `,
  model: 'openai/gpt-4o-mini',
});
