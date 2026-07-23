export type EmptySDKOptions = {
  apiKey: string;
  baseUrl?: string;
};

export class EmptySDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: EmptySDKOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://api.example.com";
  }

  async ping() {
    return {
      ok: true,
      baseUrl: this.baseUrl,
    };
  }

  getApiKey() {
    return this.apiKey;
  }
}
