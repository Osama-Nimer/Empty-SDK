import type { Express } from "express";

import { ExpressEndpointDiscoveryAdapter } from "./discovery/express-adapter.js";

import type {
  EndpointDiscoveryResult
} from "./discovery/types.js";

export interface EmptySDKOptions {
  apiKey: string;
}

export class EmptySDK {
  private readonly apiKey: string;

  private readonly expressAdapter =
    new ExpressEndpointDiscoveryAdapter();

  private app?: Express;

  constructor(options: EmptySDKOptions) {
    if (!options.apiKey) {
      throw new Error("SDK API key is required.");
    }

    this.apiKey = options.apiKey;
  }

  use(app: Express): this {
    this.app = app;

    return this;
  }

  discoverEndpoints(): EndpointDiscoveryResult {
    if (!this.app) {
      throw new Error(
        "No Express application has been connected. Call sdk.use(app) first."
      );
    }

    return this.expressAdapter.discover(this.app);
  }
}

export type {
  DiscoveredEndpoint,
  EndpointDiscoveryResult,
  SupportedHttpMethod
} from "./discovery/types.js";