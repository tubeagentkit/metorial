import { SlateTool } from 'slates';
import { z } from 'zod';
import { Client } from '../lib/client';
import { spec } from '../spec';

export let listChannelVideos = SlateTool.create(spec, {
  name: 'List YouTube Channel Videos',
  key: 'list_channel_videos',
  description: `List a YouTube channel's videos, newest first, one page at a time.
Give the channel for the first page, then pass the returned continuation token for later pages.`,
  instructions: ['Accepts a channel @handle, channel URL, or channel ID (UC...).'],
  tags: {
    readOnly: true
  }
})
  .input(
    z.object({
      channel: z
        .string()
        .optional()
        .describe('Channel @handle, URL, or ID. Required unless continuation is set'),
      continuation: z
        .string()
        .optional()
        .describe('Continuation token from a previous response, for the next page')
    })
  )
  .output(
    z.object({
      videos: z.array(z.record(z.string(), z.any())).describe('Videos on this page'),
      hasMore: z.boolean().describe('Whether more pages exist'),
      continuationToken: z.string().nullable().describe('Token for the next page, or null')
    })
  )
  .handleInvocation(async ctx => {
    if (!ctx.input.channel && !ctx.input.continuation) {
      throw new Error('Provide a channel for the first page, or a continuation token for later pages.');
    }
    let client = new Client({ token: ctx.auth.token });

    let result = await client.listChannelVideos({
      channel: ctx.input.channel,
      continuation: ctx.input.continuation
    });

    return {
      output: {
        videos: result.videos ?? [],
        hasMore: Boolean(result.has_more),
        continuationToken: result.continuation_token ?? null
      },
      message: `Listed ${(result.videos ?? []).length} videos${result.has_more ? ' (more available)' : ''}.`
    };
  })
  .build();
