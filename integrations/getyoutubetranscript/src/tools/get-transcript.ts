import { SlateTool } from 'slates';
import { z } from 'zod';
import { Client } from '../lib/client';
import { spec } from '../spec';

let segmentSchema = z.object({
  start: z.number().describe('Start time in seconds'),
  duration: z.number().describe('Duration in seconds'),
  text: z.string().describe('Caption text')
});

export let getTranscript = SlateTool.create(spec, {
  name: 'Get YouTube Transcript',
  key: 'get_transcript',
  description: `Get the transcript of a YouTube video from its URL or video ID, with the video title and channel.
Set timestamps to true to also get one segment per caption line with start time and duration, for quoting or linking moments.
The transcript is returned in the same request; there is no job to poll.`,
  instructions: [
    'Pass any YouTube URL (watch, youtu.be, Shorts, live) or the 11-character video ID.',
    'Use timestamps only when you need per-line timing; plain text is shorter.'
  ],
  constraints: [
    'Only public videos with captions are supported. Videos without captions return a not-found error.'
  ],
  tags: {
    readOnly: true
  }
})
  .input(
    z.object({
      video: z.string().describe('YouTube video URL or 11-character video ID'),
      language: z
        .string()
        .optional()
        .describe('Preferred caption language code, e.g. "en", "es"'),
      timestamps: z
        .boolean()
        .optional()
        .describe('If true, also return per-line segments with start and duration in seconds')
    })
  )
  .output(
    z.object({
      videoId: z.string().describe('YouTube video ID'),
      title: z.string().optional().describe('Video title'),
      channel: z.string().optional().describe('Channel name'),
      language: z.string().optional().describe('Language code of the returned captions'),
      wordCount: z.number().optional().describe('Number of words in the transcript'),
      transcript: z.string().describe('Full transcript as plain text'),
      segments: z.array(segmentSchema).optional().describe('Per-line segments when timestamps is true')
    })
  )
  .handleInvocation(async ctx => {
    let client = new Client({ token: ctx.auth.token });

    let result = await client.getTranscript({
      video: ctx.input.video,
      language: ctx.input.language,
      timestamps: ctx.input.timestamps
    });

    return {
      output: {
        videoId: result.video_id,
        title: result.title,
        channel: result.author_name,
        language: result.language_code,
        wordCount: result.word_count,
        transcript: result.transcript,
        segments: result.segments
      },
      message: `Transcript of **${result.title ?? result.video_id}** (${result.word_count ?? 0} words${result.segments ? `, ${result.segments.length} segments` : ''}, language: ${result.language_code ?? 'unknown'}).`
    };
  })
  .build();
