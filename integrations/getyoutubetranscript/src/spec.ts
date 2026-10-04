import { SlateSpecification } from 'slates';
import { auth } from './auth';
import { config } from './config';

export let spec = SlateSpecification.create({
  key: 'getyoutubetranscript',
  name: 'GetYouTubeTranscript',
  description:
    'YouTube transcript API: video transcripts as plain text or timestamped segments, plus YouTube search, channel video and playlist listings.',
  metadata: {},
  config,
  auth
});
