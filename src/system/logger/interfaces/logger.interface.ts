export interface ILogger {
    warn(...args): void;
    error(...args): void;
    info(...args): void;
}

export const TLogger = Symbol('ILogger');