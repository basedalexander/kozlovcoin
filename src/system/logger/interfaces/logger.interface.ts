export interface ILogger {
    log(...args): void;
    warn(...args): void;
    error(...args): void;
    info(...args): void;
}

export const TLogger = 'ILogger';