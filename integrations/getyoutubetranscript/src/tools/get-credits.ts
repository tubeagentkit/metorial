import { SlateTool } from 'slates';
import { z } from 'zod';
import { Client } from '../lib/client';
import { spec } from '../spec';

export let getCredits = SlateTool.create(spec, {
  name: 'Get Credits',
  key: 'get_credits',
  description: 'Check the remaining GetYouTubeTranscript credits, plan, and rate limit for the API key. This call is free.',
  tags: {
    readOnly: true
  }
})
  .input(z.object({}))
  .output(
    z.object({
      planCreditsLeft: z.number().describe('Credits left in the current plan period'),
      topupCreditsLeft: z.number().optional().describe('Credits left from top-ups'),
      plan: z.string().optional().describe('Plan name'),
      rateLimitPerMinute: z.number().optional().describe('Requests allowed per minute')
    })
  )
  .handleInvocation(async ctx => {
    let client = new Client({ token: ctx.auth.token });
    let result = await client.getCredits();

    return {
      output: {
        planCreditsLeft: result.plan_credits_left,
        topupCreditsLeft: result.topup_credits_left,
        plan: result.plan,
        rateLimitPerMinute: result.rate_limit_per_minute
      },
      message: `${result.plan_credits_left} plan credits and ${result.topup_credits_left ?? 0} top-up credits left (${result.plan ?? 'unknown'} plan).`
    };
  })
  .build();
