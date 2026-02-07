export declare class FileSystem {
    static ensureDir(path: string): Promise<void>;
    static writeJson(path: string, data: unknown): Promise<void>;
    static readJson<T>(path: string): Promise<T>;
    static exists(path: string): Promise<boolean>;
    static copy(src: string, dest: string): Promise<void>;
    static readFile(path: string): Promise<string>;
    static writeFile(path: string, content: string): Promise<void>;
}
export declare function getRQPPath(projectPath: string): string;
export declare function getSoulsPath(projectPath: string): string;
export declare function getStatePath(projectPath: string): string;
export declare function getProtocolsPath(projectPath: string): string;
//# sourceMappingURL=fileSystem.d.ts.map