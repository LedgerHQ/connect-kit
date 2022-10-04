export type Logger = (message: string, ...others: any[]) => void;

const disabled = false;

export const getLogger =
  (context: string): Logger => {
    if (disabled) return () => null;

    return (message: string, ...others: any[]) => {
      console.log(`[${context}] ${message}`, ...others);
    };
  }

export const getErrorLogger =
  (context: string): Logger =>
  (message: string, error: Error, ...others: any[]) => {
    console.error(`[${context}] ${message}`, ...others);
  };
