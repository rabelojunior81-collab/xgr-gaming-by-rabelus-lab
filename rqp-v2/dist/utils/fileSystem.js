import fs from 'fs-extra';
import { join } from 'path';
export class FileSystem {
    static async ensureDir(path) {
        await fs.ensureDir(path);
    }
    static async writeJson(path, data) {
        await fs.writeJson(path, data, { spaces: 2 });
    }
    static async readJson(path) {
        return fs.readJson(path);
    }
    static async exists(path) {
        return fs.pathExists(path);
    }
    static async copy(src, dest) {
        await fs.copy(src, dest);
    }
    static async readFile(path) {
        return fs.readFile(path, 'utf-8');
    }
    static async writeFile(path, content) {
        await fs.writeFile(path, content, 'utf-8');
    }
}
export function getRQPPath(projectPath) {
    return join(projectPath, '.rqp');
}
export function getSoulsPath(projectPath) {
    return join(getRQPPath(projectPath), 'souls');
}
export function getStatePath(projectPath) {
    return join(getRQPPath(projectPath), 'state');
}
export function getProtocolsPath(projectPath) {
    return join(getRQPPath(projectPath), 'protocols');
}
//# sourceMappingURL=fileSystem.js.map