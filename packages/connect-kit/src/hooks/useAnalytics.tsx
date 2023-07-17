import { useCallback } from "react";
import { AnalyticsBrowser, Plugin } from "@segment/analytics-next";

type UseAnalyticsState = {
  analytics: AnalyticsBrowser;
  globalProperties: Record<string, unknown>;
  globalOptions: Record<string, unknown>;
};

let globalState: UseAnalyticsState | null = null;

type UseAnalyticsReturn = {
  track: (
    eventName: string,
    eventProperties?: Record<string, unknown>
  ) => Promise<void>;
  page: (
    pageName: string,
    eventProperties?: Record<string, unknown>
  ) => Promise<void>;
  init: (
    globalProperties?: Record<string, unknown>,
    globalOptions?: Record<string, unknown>
  ) => Promise<void>;
};

export const debug: Plugin = {
  name: "Debug",
  type: "before",
  version: "1.0.0",

  isLoaded: () => true,
  load: () => {
    // tslint:disable-next-line:no-console
    console.log("LOAD ANALYTICS");
    return Promise.resolve();
  },

  track: (ctx: any) => {
    // tslint:disable-next-line:no-console
    console.log("TRACK", ctx.event);
    return ctx;
  },

  page: (ctx: any) => {
    // tslint:disable-next-line:no-console
    console.log("PAGE", ctx.event);
    return ctx;
  },
};

export function useAnalytics(): UseAnalyticsReturn {
  const init: UseAnalyticsReturn["init"] = useCallback(
    async (globalProperties = {}, globalOptions = {}) => {
      if (globalState) {
        return;
      }

      const writeKey = "..."

      if (writeKey) {
        const analytics = AnalyticsBrowser.load({
          writeKey,
        });

        if (process.env.NODE_ENV === "development") {
          await analytics.register(debug);
        }

        globalState = {
          analytics,
          globalOptions,
          globalProperties,
        };
      }
    },
    []
  );

  const track: UseAnalyticsReturn["track"] = useCallback(
    async (eventName, eventProperties = {}) => {
      if (!globalState) {
        return;
      }

      const allProperties = {
        ...globalState.globalProperties,
        ...eventProperties,
      };

      await globalState.analytics.track(
        eventName,
        allProperties,
        globalState.globalOptions
      );
    },
    []
  );

  const page: UseAnalyticsReturn["page"] = useCallback(
    async (pageName, eventProperties = {}) => {
      if (!globalState) {
        return;
      }

      const allProperties = {
        ...globalState.globalProperties,
        ...eventProperties,
      };

      await globalState.analytics.page(
        pageName,
        allProperties,
        globalState.globalOptions
      );
    },
    []
  );

  return {
    init,
    track,
    page,
  };
}