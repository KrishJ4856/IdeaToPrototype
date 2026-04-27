import 'dotenv/config';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import * as readline from 'readline/promises';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const processIdeaStep = createStep({
  id: 'process-idea',
  description: 'Takes the raw user idea and processes it using the main agent to extract core details',
  inputSchema: z.object({
    idea: z.string().describe('The raw idea from the user'),
  }),
  outputSchema: z.object({
    structuredIdea: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.idea) {
      throw new Error('Input idea not found');
    }

    const agent = mastra?.getAgent('mainAgent');
    if (!agent) {
      throw new Error('Main agent not found');
    }

    const prompt = `Please analyze the following raw user idea and extract the core concept, target audience, and primary goal.\n\nIdea: ${inputData.idea}`;

    const response = await agent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return {
      structuredIdea: response.text,
    };
  },
});

const competitorAnalysisStep = createStep({
  id: 'competitor-analysis',
  description: 'Takes the structured idea and performs competitor analysis using web search.',
  inputSchema: z.object({
    structuredIdea: z.string().describe('The structured idea from the main agent'),
  }),
  outputSchema: z.object({
    competitorAnalysis: z.string(),
    structuredIdea: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    if (!inputData?.structuredIdea) {
      throw new Error('Input structuredIdea not found');
    }

    const agent = mastra?.getAgent('competitorAgent');
    if (!agent) {
      throw new Error('Competitor agent not found');
    }

    const prompt = `Please perform a competitor analysis and market positioning strategy for the following structured idea.\n\nIdea Details:\n${inputData.structuredIdea}`;

    console.log('\n🔍 Analyzing market and competitors...');

    const response = await agent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const competitorAnalysis = response.text;
    console.log('✅ Market analysis complete.');

    return {
      competitorAnalysis,
      structuredIdea: inputData.structuredIdea,
    };
  },
});

const pmStep = createStep({
  id: 'pm-step',
  description: 'Product Manager agent asks 5 critical questions and gets user input via terminal.',
  inputSchema: z.object({
    structuredIdea: z.string(),
    competitorAnalysis: z.string(),
  }),
  outputSchema: z.object({
    qna: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
    structuredIdea: z.string(),
    competitorAnalysis: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('pmAgent');
    if (!agent) {
      throw new Error('PM agent not found');
    }

    const prompt = `Based on the following idea and competitor analysis, generate your 5 critical questions.\n\nIdea:\n${inputData.structuredIdea}\n\nCompetitor Analysis:\n${inputData.competitorAnalysis}`;

    console.log('\n🧑‍💼 Preparing project requirements interview...');

    const response = await agent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let questions: string[] = [];
    try {
      // Clean up potential markdown blocks if the LLM ignores instructions
      const cleanJson = response.text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      questions = JSON.parse(cleanJson);

      if (!Array.isArray(questions)) {
        throw new Error('Parsed JSON is not an array');
      }
    } catch (err) {
      console.error('Failed to parse PM questions. Fallback to raw text split.');
      questions = [response.text]; // Fallback in case of parse error
    }

    console.log('\n=======================================');
    console.log('       PRODUCT MANAGER INTERVIEW       ');
    console.log('=======================================');

    const qna = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const answer = await rl.question(`\nQ${i + 1}: ${q}\nYour Answer: `);
      qna.push({ question: q, answer });
    }

    rl.close();

    console.log('\n✅ PM Interview completed!');

    return {
      qna,
      structuredIdea: inputData.structuredIdea,
      competitorAnalysis: inputData.competitorAnalysis,
    };
  },
});

const architectureStep = createStep({
  id: 'architecture-step',
  description: 'Architecture agent designs the frontend prototype and generates a PRD and Architecture document.',
  inputSchema: z.object({
    structuredIdea: z.string(),
    competitorAnalysis: z.string(),
    qna: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
  outputSchema: z.object({
    prd: z.string(),
    architecture: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('architectureAgent');
    if (!agent) {
      throw new Error('Architecture agent not found');
    }

    const qnaText = inputData.qna.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}`).join('\n\n');

    const prompt = `Based on the following data, generate the frontend PRD and Architecture documents as a strict JSON object.\n\nIdea:\n${inputData.structuredIdea}\n\nCompetitor Analysis:\n${inputData.competitorAnalysis}\n\nPM Interview Q&A:\n${qnaText}`;

    console.log('\n🏗️ Architecture Agent is designing the prototype (this may take a minute)...');

    const response = await agent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let prd = '';
    let architecture = '';
    try {
      const cleanJson = response.text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      prd = parsed.prd || '';
      architecture = parsed.architecture || '';

      if (!prd || !architecture) {
        throw new Error('Missing prd or architecture fields in JSON');
      }
    } catch (err) {
      console.error('Failed to parse Architecture JSON properly. Storing raw output in PRD field.');
      prd = response.text; // fallback
      architecture = 'Parse error. See PRD field for raw output.';
    }

    console.log('\n✅ Architecture Design completed!');

    return {
      prd,
      architecture,
    };
  },
});

const codingStep = createStep({
  id: 'coding-step',
  description: 'Coding agent generates the HTML + CSS code from the PRD and Architecture.',
  inputSchema: z.object({
    prd: z.string(),
    architecture: z.string(),
  }),
  outputSchema: z.object({
    codebase: z.array(
      z.object({
        path: z.string(),
        content: z.string(),
      })
    ),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('codingAgent');
    if (!agent) {
      throw new Error('Coding agent not found');
    }

    const prompt = `Based on the following PRD and Architecture, generate the entire codebase as a strict JSON object.\n\nPRD:\n${inputData.prd}\n\nArchitecture:\n${inputData.architecture}`;

    console.log('\n💻 Coding Agent is writing the code (this may take a few minutes)...');

    const response = await agent.generate([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let codebase: any[] = [];
    try {
      const cleanJson = response.text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      codebase = parsed.codebase || [];
      if (!Array.isArray(codebase) || codebase.length === 0) {
        throw new Error('Codebase array is missing or empty');
      }
    } catch (err) {
      console.error('Failed to parse Codebase JSON properly.', err);
      // Fallback
      codebase = [{ path: 'error.txt', content: response.text }];
    }

    console.log('\n✅ Code Generation completed!');

    console.log('\n💾 Saving generated prototype to disk...');
    try {
      const outDir = path.resolve(process.cwd(), '../generated-app');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      let fileCount = 0;
      for (const file of codebase) {
        if (!file.path || !file.content) continue;
        const filePath = path.join(outDir, file.path);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, file.content, 'utf8');
        fileCount++;
      }
      console.log(`✅ Saved ${fileCount} files to ../generated-app`);
    } catch (err) {
      console.error('Failed to write temporary files to disk:', err);
    }

    return {
      codebase,
    };
  },
});

const deployStep = createStep({
  id: 'deploy-step',
  description: 'Deploys the generated HTML to Vercel.',
  inputSchema: z.object({
    codebase: z.array(
      z.object({
        path: z.string(),
        content: z.string(),
      })
    ),
  }),
  outputSchema: z.object({
    deployedUrl: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log('\n🚀 Deploying prototype to Vercel (this takes a few seconds)...');
    if (!process.env.VERCEL_TOKEN) {
      console.warn('\n⚠️ VERCEL_TOKEN not found in .env, skipping deployment.');
      return { deployedUrl: 'No VERCEL_TOKEN provided' };
    }

    try {
      const outDir = path.resolve(process.cwd(), '../generated-app');
      
      const output = execSync(
        `npx vercel --prod --cwd "${outDir}" --token ${process.env.VERCEL_TOKEN} --yes 2>&1`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
      const url = match ? match[0] : 'URL not found in output';

      console.log('\n✨ All done! Your prototype is ready.');
      console.log(`Deployed Link: ${url}\n`);

      return {
        deployedUrl: url,
      };
    } catch (err: any) {
      const output = err.stdout || err.stderr || '';
      const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
      const url = match ? match[0] : 'Deployment failed';
      
      console.log('\n✨ All done! Your prototype is ready.');
      console.log(`Deployed Link: ${url}\n`);

      return {
        deployedUrl: url,
      };
    }
  },
});

export const ideaWorkflow = createWorkflow({
  id: 'idea-workflow',
  inputSchema: z.object({
    idea: z.string(),
  }),
  outputSchema: z.object({
    codebase: z.array(
      z.object({
        path: z.string(),
        content: z.string(),
      })
    ),
    deployedUrl: z.string().optional(),
  }),
})
  .then(processIdeaStep)
  .then(competitorAnalysisStep)
  .then(pmStep)
  .then(architectureStep)
  .then(codingStep)
  .then(deployStep);

ideaWorkflow.commit();
