import type { Express } from "express";

export interface ExpressRoute {
  path: string | string[];
  methods: Record<string, boolean>;
}

export interface ExpressLayer {
  route?: ExpressRoute;

  name?: string;

  path?: string;

  regexp?: RegExp;

  handle?: ExpressRouterHandle;
}

export interface ExpressRouterHandle {
  stack?: ExpressLayer[];
}

export type ExpressApplicationWithRouter = Omit<Express, "router"> & {
  router?: ExpressRouterHandle;

  _router?: ExpressRouterHandle;
};
