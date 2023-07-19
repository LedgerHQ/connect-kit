import { useCallback } from "react";
import { AnalyticsBrowser, Plugin } from "@segment/analytics-next";
import { v4 as uuidv4 } from 'uuid';

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
  addStepToFlow: (
    step: string
  ) => void;
  sendUserFlow: () => void;
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

const userFlow: Record<number, string> = {}


export function useAnalytics(): UseAnalyticsReturn {
  const init: UseAnalyticsReturn["init"] = useCallback(
    async (globalProperties = {}, globalOptions = {}) => {
      if (globalState) {
        return;
      }

      const writeKey = process.env.SEGMENT_KEY

      if (writeKey) {
        const analytics = AnalyticsBrowser.load({
          writeKey,
        });

        if (process.env.NODE_ENV === "development") {
          await analytics.register(debug);
        }

        await analytics.identify(uuidv4());

        globalState = {
          analytics,
          globalOptions,
          globalProperties,
        };
      }
    },
    []
  );

  const addStepToFlow: UseAnalyticsReturn["addStepToFlow"] = useCallback(
    async (step: string) => {
      if (!globalState) {
        return;
      }
      userFlow[Object.keys(userFlow).length] = step;
    },
    []
  );

  const sendUserFlow: UseAnalyticsReturn["sendUserFlow"] = useCallback(
    async () => {
      if (Object.keys(userFlow).length == 0 || !globalState) {
        return;
      }
      await globalState.analytics.track(
        "userFlow",
        userFlow
      );
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
    addStepToFlow,
    sendUserFlow
  };
}