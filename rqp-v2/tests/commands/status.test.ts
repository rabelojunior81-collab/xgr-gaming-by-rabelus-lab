import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { statusCommand } from '../../src/commands/status.js';
import { FileSystem } from '../../src/utils/fileSystem.js';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdtempSync, rmSync } from 'fs';

describe('status command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'rqp-test-'));
    
    // Create mock RQP structure
    await FileSystem.ensureDir(join(tempDir, '.rqp', 'state'));
    await FileSystem.writeJson(join(tempDir, '.rqp', 'state', 'current-session.json'), {
      projectName: 'test-project',
      currentPhase: 'discovery',
      currentAgent: 'ORCH-000',
      gatesCompleted: 0,
      totalGates: 6,
      lastUpdated: new Date().toISOString(),
    });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should show status for valid RQP project', async () => {
    const originalCwd = process.cwd;
    process.cwd = () => tempDir;

    // Should not throw
    await statusCommand({});

    process.cwd = originalCwd;
  });

  it('should fail for non-RQP project', async () => {
    const nonRqpDir = mkdtempSync(join(tmpdir(), 'non-rqp-'));
    const originalCwd = process.cwd;
    process.cwd = () => nonRqpDir;

    try {
      await statusCommand({});
      expect.fail('Should have thrown');
    } catch {
      // Expected
    }

    process.cwd = originalCwd;
    rmSync(nonRqpDir, { recursive: true, force: true });
  });
});
