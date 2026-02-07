import { describe, it, expect } from 'vitest';
import { InputValidator } from '../../../src/core/validators/InputValidator.js';

describe('InputValidator', () => {
  it('should validate agent codes', () => {
    expect(InputValidator.validateAgentCode('ORCH-000')).toBe(true);
    expect(InputValidator.validateAgentCode('INVALID')).toBe(false);
  });
});
