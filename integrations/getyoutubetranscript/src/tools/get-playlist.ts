import { SlateTool } from 'slates';
import { z } from 'zod';
import { Client } from '../lib/client';
import { spec } from '../spec';

export let getYouTubePlaylist = SlateTool.create(spec, {
  name: 'Get YouTube Playlist',
  key: 'get_playlist',
  description: `List the videos in a YouTube playlist, one page at a time.
Give the playlist URL or ID for the first page, then pass the returned continuation token for later pages.`,
  tags: {
    readOnly: true
  }
})
  .input(
    z.object({
      list: z
        .string()
        .optional()
        .describe('Playlist URL or ID (PL...). Required unless continuation is set'),
      continuation: z
        .string()
        .optional()
        .describe('Continuation token from a previous response, for the next page')
    })
  )
  .output(
    z.object({
      playlistId: z.string().optional().describe('Playlist ID'),
      title: z.string().optional().describe('Playlist title'),
      videos: z.array(z.record(z.string(), z.any())).describe('Videos on this page'),
      hasMore: z.boolean().describe('Whether more pages exist'),
      continuationToken: z.string().nullable().describe('Token for the next page, or null')
    })
  )
  .handleInvocation(async ctx => {
    if (!ctx.input.list && !ctx.input.continuation) {
      throw new Error('Provide a playlist for the first page, or a continuation token for later pages.');
    }
    let client = new Client({ token: ctx.auth.token });

    let result = await client.getPlaylist({
      list: ctx.input.list,
      continuation: ctx.input.continuation
    });

    return {
      output: {
        playlistId: result.playlist_id,
        title: result.title,
        videos: result.videos ?? [],
        hasMore: Boolean(result.has_more),
        continuationToken: result.continuation_token ?? null
      },
      message: `Listed ${(result.videos ?? []).length} videos from **${result.title ?? 'playlist'}**${result.has_more ? ' (more available)' : ''}.`
    };
  })
  .build();
