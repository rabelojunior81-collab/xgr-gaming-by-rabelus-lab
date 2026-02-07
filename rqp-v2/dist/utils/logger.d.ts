import { LogLevel } from '../types/index.js';
export declare class Logger {
    private static level;
    private static verbose;
    static setLevel(level: LogLevel): void;
    static setVerbose(verbose: boolean): void;
    static debug(message: string): void;
    static info(message: string): void;
    static success(message: string): void;
    static warn(message: string): void;
    static error(message: string): void;
    static heading(title: string): void;
    static box(content: string[]): void;
}
//# sourceMappingURL=logger.d.ts.map