export type Logger = (message: string, ...others: unknown[]) => void;

let debugLogsEnabled = false;

export const getDebugLogger = (context: string): Logger => {
  return (message: string, ...others: unknown[]) => {
    if (debugLogsEnabled) {
      console.debug(`[${context}] ${message}`, ...others);
    }
  };
}

export const getErrorLogger = (context: string): Logger => {
  return (message: string, ...others: unknown[]) => {
    console.error(`[${context}] ${message}`, ...others);
  };
}

export const enableDebugLogs = (): void => {
  debugLogsEnabled = true
};
