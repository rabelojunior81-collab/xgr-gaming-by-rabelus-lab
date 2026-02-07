import { Soul, Gate } from '../../types/index.js';

export class SchemaValidator {
  static validateSoul(data: unknown): Soul {
    // Basic validation - in real implementation use Zod
    const soul = data as Soul;
    
    if (!soul.soul_id) throw new Error('Soul ID required');
    if (!soul.soul_version) throw new Error('Soul version required');
    if (!soul.identity) throw new Error('Soul identity required');
    
    return soul;
  }

  static validateGate(data: unknown): Gate {
    const gate = data as Gate;
    
    if (!gate.id) throw new Error('Gate ID required');
    if (!gate.phase) throw new Error('Gate phase required');
    if (!gate.checkItems) throw new Error('Gate check items required');
    
    return gate;
  }

  static isValidSoul(data: unknown): boolean {
    try {
      SchemaValidator.validateSoul(data);
      return true;
    } catch {
      return false;
    }
  }

  static isValidGate(data: unknown): boolean {
    try {
      SchemaValidator.validateGate(data);
      return true;
    } catch {
      return false;
    }
  }
}
