
import { Mastra } from '@mastra/core/mastra';
import { ideaWorkflow } from './workflows/idea-workflow.js';
import { mainAgent } from './agents/main-agent.js';
import { competitorAgent } from './agents/competitor-agent.js';
import { pmAgent } from './agents/pm-agent.js';
import { architectureAgent } from './agents/architecture-agent.js';
import { codingAgent } from './agents/coding-agent.js';

export const mastra = new Mastra({
  workflows: { ideaWorkflow },
  agents: { mainAgent, competitorAgent, pmAgent, architectureAgent, codingAgent },
});
