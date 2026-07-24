import type { Express } from "express";

import type {
  DiscoveredEndpoint,
  EndpointDiscoveryResult,
  SupportedHttpMethod,
} from "./types.js";

import type {
  ExpressApplicationWithRouter,
  ExpressLayer,
} from "./express-types.js";

const SUPPORTED_METHODS = new Set<SupportedHttpMethod>([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
]);

export class ExpressEndpointDiscoveryAdapter {
  discover(app: Express): EndpointDiscoveryResult {
    const expressApp = app as unknown as ExpressApplicationWithRouter;

    const router = expressApp.router ?? expressApp._router;

    if (!router?.stack) {
      return {
        framework: "express",
        endpointCount: 0,
        endpoints: [],
        discoveredAt: new Date().toISOString(),
      };
    }

    const endpoints = this.readStack(router.stack);

    return {
      framework: "express",
      endpointCount: endpoints.length,
      endpoints,
      discoveredAt: new Date().toISOString(),
    };
  }

  private readStack(
    stack: ExpressLayer[],
    parentPath = "",
  ): DiscoveredEndpoint[] {
    const endpoints: DiscoveredEndpoint[] = [];

    for (const layer of stack) {
      if (layer.route) {
        endpoints.push(...this.extractRoute(layer, parentPath));

        continue;
      }

      const nestedStack = layer.handle?.stack;

      if (nestedStack) {
        const routerPrefix = this.extractRouterPrefix(layer);

        endpoints.push(
          ...this.readStack(
            nestedStack,
            this.joinPaths(parentPath, routerPrefix),
          ),
        );
      }
    }

    return this.removeDuplicates(endpoints);
  }

  private extractRoute(
    layer: ExpressLayer,
    parentPath: string,
  ): DiscoveredEndpoint[] {
    if (!layer.route) {
      return [];
    }

    const paths = Array.isArray(layer.route.path)
      ? layer.route.path
      : [layer.route.path];

    const methods = Object.entries(layer.route.methods)
      .filter(([, enabled]) => enabled)
      .map(([method]) => method.toUpperCase())
      .filter((method): method is SupportedHttpMethod =>
        SUPPORTED_METHODS.has(method as SupportedHttpMethod),
      );

    const endpoints: DiscoveredEndpoint[] = [];

    for (const path of paths) {
      for (const method of methods) {
        endpoints.push({
          method,
          path: this.joinPaths(parentPath, path),
        });
      }
    }

    return endpoints;
  }

  private extractRouterPrefix(layer: ExpressLayer): string {
    /*
     * Express does not always preserve the original mount path
     * as a clean public string.
     *
     * This basic version supports layers that expose `path`.
     * More complex mounted routers may need version-specific
     * parsing or registration interception.
     */
    if (typeof layer.path === "string") {
      return layer.path;
    }

    return "";
  }

  private joinPaths(parent: string, child: string): string {
    const normalizedParent = parent === "/" ? "" : parent.replace(/\/+$/, "");

    const normalizedChild =
      child === "/" ? "" : child.startsWith("/") ? child : `/${child}`;

    const result = `${normalizedParent}${normalizedChild}`;

    return result || "/";
  }

  private removeDuplicates(
    endpoints: DiscoveredEndpoint[],
  ): DiscoveredEndpoint[] {
    const endpointMap = new Map<string, DiscoveredEndpoint>();

    for (const endpoint of endpoints) {
      const key = `${endpoint.method}:${endpoint.path}`;

      endpointMap.set(key, endpoint);
    }

    return Array.from(endpointMap.values());
  }
}
