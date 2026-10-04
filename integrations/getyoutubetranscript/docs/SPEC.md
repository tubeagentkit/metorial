# Slates Specification for GetYouTubeTranscript

## Overview

GetYouTubeTranscript is a YouTube transcript API. It returns the captions of a YouTube video as plain text or as timestamped segments, together with the video title and channel, and also provides YouTube search, channel video listings and playlist listings. Transcripts are fetched server-side and returned in the same request, so there are no jobs to poll.

## Authentication

All API requests require an API key, sent as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

To obtain an API key:

1. Sign up at [getyoutubetranscript.com](https://getyoutubetranscript.com).
2. Create a key in the [dashboard](https://getyoutubetranscript.com/dashboard). New accounts include free credits.

The base URL for all API endpoints is `https://getyoutubetranscript.com/api/v1`. There is no OAuth flow and there are no scopes.

## Features

### Video Transcripts

Get the transcript of a YouTube video by URL (watch, youtu.be, Shorts, live) or by 11-character video ID.

- Optional caption language code (for example `en`, `es`).
- Optional per-line timing: with timestamps enabled, each caption line is returned as `{ start, duration, text }` in seconds.
- The response includes the video ID, title, channel name and URL, thumbnail, language code and word count.
- Only public videos with captions are supported; videos without captions return a not-found error.

### YouTube Search

Search YouTube for videos or channels. Results include titles, video or channel IDs, links, channel, views, length and upload date. Results are paginated with an opaque continuation token.

### Channel Videos

List a channel's videos, newest first, by @handle, channel URL or channel ID. Paginated with a continuation token.

### Playlists

List the videos in a playlist by URL or playlist ID, with the playlist title. Paginated with a continuation token.

### Credits

Check the remaining plan and top-up credits, plan name and per-minute rate limit. This call is free.

## Events

The API does not provide webhooks or events.
