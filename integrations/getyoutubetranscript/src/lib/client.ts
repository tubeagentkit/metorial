import { createAxios } from 'slates';

let http = createAxios({
  baseURL: 'https://getyoutubetranscript.com/api/v1'
});

/** Every response is `{ success, data }`; these methods return `data`. */
export class Client {
  private token: string;

  constructor(config: { token: string }) {
    this.token = config.token;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`
    };
  }

  private async get(path: string, params: Record<string, string | undefined> = {}) {
    let response = await http.get(path, { params, headers: this.headers });
    return response.data.data;
  }

  async getTranscript(params: { video: string; language?: string; timestamps?: boolean }) {
    return this.get('/transcript', {
      v: params.video,
      language: params.language,
      timestamps: params.timestamps ? 'true' : undefined
    });
  }

  async search(params: { query?: string; type?: 'video' | 'channel'; pageToken?: string }) {
    return this.get('/search', { q: params.query, type: params.type, page_token: params.pageToken });
  }

  async listChannelVideos(params: { channel?: string; continuation?: string }) {
    return this.get(
      '/channel/videos',
      params.continuation ? { continuation: params.continuation } : { channel: params.channel }
    );
  }

  async getPlaylist(params: { list?: string; continuation?: string }) {
    return this.get(
      '/playlist',
      params.continuation ? { continuation: params.continuation } : { list: params.list }
    );
  }

  async getCredits() {
    return this.get('/credits');
  }
}
