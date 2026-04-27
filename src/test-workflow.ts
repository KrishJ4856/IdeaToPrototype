import { mastra } from './mastra/index.js';
import "dotenv/config"
import * as readline from 'readline/promises';

async function main() {
  console.log('🚀 Starting Idea Workflow...');

  const workflow = mastra.getWorkflow('ideaWorkflow');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const idea = await rl.question('\n💡 Enter your app idea: ');
  rl.close();

  console.log(`\nStarting generation for: ${idea}\n`);

  try {
    const run = await workflow.createRun();
    const result = await run.start({ inputData: { idea } });

    console.log('\n✨ All done! Your prototype is ready.');
    if (result.results && result.results.deployedUrl) {
      console.log(`\n🌐 Live Prototype: ${result.results.deployedUrl}\n`);
    }
  } catch (error) {
    console.error('\n❌ Error executing workflow:', error);
  }
}

main().catch(console.error);
