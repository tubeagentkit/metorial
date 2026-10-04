import { SlateConfig } from 'slates';
import { z } from 'zod';

export let config = SlateConfig.create(
  z.object({
    // No global configuration needed; authentication is the API key in auth.ts
  })
);
