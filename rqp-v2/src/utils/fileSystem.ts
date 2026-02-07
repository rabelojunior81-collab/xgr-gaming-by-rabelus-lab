import fs from 'fs-extra';
import { join } from 'path';

export class FileSystem {
  static async ensureDir(path: string): Promise<void> {
    await fs.ensureDir(path);
  }

  static async writeJson(path: string, data: unknown): Promise<void> {
    await fs.writeJson(path, data, { spaces: 2 });
  }

  static async readJson<T>(path: string): Promise<T> {
    return fs.readJson(path) as Promise<T>;
  }

  static async exists(path: string): Promise<boolean> {
    return fs.pathExists(path);
  }

  static async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  }

  static async readFile(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8');
  }

  static async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, 'utf-8');
  }
}

export function getRQPPath(projectPath: string): string {
  return join(projectPath, '.rqp');
}

export function getSoulsPath(projectPath: string): string {
  return join(getRQPPath(projectPath), 'souls');
}

export function getStatePath(projectPath: string): string {
  return join(getRQPPath(projectPath), 'state');
}

export function getProtocolsPath(projectPath: string): string {
  return join(getRQPPath(projectPath), 'protocols');
}
