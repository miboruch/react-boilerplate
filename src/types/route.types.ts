import React from "react";

export interface RouteConfig {
  path: string;
  component: React.ReactNode;
  name: string;
  auth: boolean;
  showNavigation: boolean;
}

export type RouteConstant = Omit<RouteConfig, "component">;
