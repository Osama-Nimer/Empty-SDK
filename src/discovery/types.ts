export type SupportedHttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

export interface DiscoveredEndpoint {
  method: SupportedHttpMethod;
  path: string;
}

export interface EndpointDiscoveryResult {
  framework: "express";
  endpointCount: number;
  endpoints: DiscoveredEndpoint[];
  discoveredAt: string;
}
