import { describe, it, expect } from 'vitest';
import { GateManager } from '../../../src/core/managers/GateManager.js';

describe('GateManager', () => {
  it('should initialize with default gates', () => {
    const manager = new GateManager();
    const gates = manager.getAllGates();
    
    expect(gates.length).toBeGreaterThan(0);
    expect(gates.map(g => g.id)).toContain('SG-001');
  });

  it('should get gate by id', () => {
    const manager = new GateManager();
    const gate = manager.getGate('SG-001');
    
    expect(gate).toBeDefined();
    expect(gate?.name).toBe('Discovery Gate');
  });
});
