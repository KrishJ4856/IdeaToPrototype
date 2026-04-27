import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import Exa from 'exa-js';
import "dotenv/config"

// @ts-ignore
const exa = new Exa(process.env.EXA_API_KEY || 'dummy_key_if_not_set');

export const webSearch = createTool({
  id: 'exa-web-search',
  description: 'Search the web using Exa to find competitors, user reviews, and product offerings.',
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string().nullable(),
      url: z.string(),
      content: z.string(),
      publishedDate: z.string().optional(),
    }),
  ),
  execute: async (args: any) => {
    // Handle both new and old mastra parameter styles
    const query = args.context ? args.context.query : args.query;


    if (!process.env.EXA_API_KEY) {
      console.log(`[Tool: webSearch] WARN: EXA_API_KEY not set. Returning dummy data for testing.`);
      return [
        { title: "Mock Competitor A", url: "https://example.com/a", content: "A basic AI marketplace. Users complain it's too expensive." },
        { title: "Mock Competitor B", url: "https://example.com/b", content: "Great features but hard to use for beginners." }
      ];
    }

    try {
      const { results } = await exa.search(query, {
        numResults: 2,
        contents: {
          text: true
        }
      });

      return results.map((result: any) => ({
        title: result.title,
        url: result.url,
        content: result.text ? result.text.slice(0, 500) : '',
        publishedDate: result.publishedDate,
      }));
    } catch (error) {
      console.error('[Tool: webSearch] Error:', error);
      return [];
    }
  },
});
