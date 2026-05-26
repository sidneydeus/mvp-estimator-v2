const levels = {
  info: '🟢 INFO',
  warn: '🟡 WARN',
  error: '🔴 ERROR',
  debug: '🔵 DEBUG',
};

export const logger = {
  info: (message: string, ...args: any[]) =>
    console.log(`[${new Date().toISOString()}] ${levels.info}: ${message}`, ...args),
  warn: (message: string, ...args: any[]) =>
    console.warn(`[${new Date().toISOString()}] ${levels.warn}: ${message}`, ...args),
  error: (message: string, ...args: any[]) =>
    console.error(`[${new Date().toISOString()}] ${levels.error}: ${message}`, ...args),
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${new Date().toISOString()}] ${levels.debug}: ${message}`, ...args);
    }
  },
};
