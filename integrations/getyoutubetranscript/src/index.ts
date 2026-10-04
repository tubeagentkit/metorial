import { Slate } from 'slates';
import { spec } from './spec';
import { getCredits, getTranscript, getYouTubePlaylist, listChannelVideos, searchYouTube } from './tools';

export let provider = Slate.create({
  spec,
  tools: [getTranscript, searchYouTube, listChannelVideos, getYouTubePlaylist, getCredits],
  triggers: []
});
