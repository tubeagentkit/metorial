import { SlateTool } from 'slates';
import { z } from 'zod';
import { Client } from '../lib/client';
import { spec } from '../spec';

export let searchYouTube = SlateTool.create(spec, {
  name: 'Search YouTube',
  key: 'search_youtube',
  description: `Search YouTube for videos or channels. Returns titles, video or channel IDs, links, channel, views, length and upload date.
Pass the returned continuation token as pageToken to get the next page.`,
  tags: {
    readOnly: true
  }
})
  .input(
    z.object({
      query: z.string().optional().describe('Search query. Required unless pageToken is set'),
      type: z.enum(['video', 'channel']).optional().describe('Result type, video by default'),
      pageToken: z
        .string()
        .optional()
        .describe('Continuation token from a previous search, for the next page')
    })
  )
  .output(
    z.object({
      results: z.array(z.record(z.string(), z.any())).describe('Video or channel results'),
      continuationToken: z
        .string()
        .nullable()
        .describe('Token for the next page, or null when there are no more pages')
    })
  )
  .handleInvocation(async ctx => {
    let client = new Client({ token: ctx.auth.token });

    let result = await client.search({
      query: ctx.input.query,
      type: ctx.input.type,
      pageToken: ctx.input.pageToken
    });
    let results = result.video_results ?? result.channel_results ?? [];

    return {
      output: {
        results,
        continuationToken: result.continuation_token ?? null
      },
      message: `Found ${results.length} ${ctx.input.type === 'channel' ? 'channels' : 'videos'}${result.continuation_token ? ' (more available)' : ''}.`
    };
  })
  .build();
