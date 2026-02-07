export class SchemaValidator {
    static validateSoul(data) {
        // Basic validation - in real implementation use Zod
        const soul = data;
        if (!soul.soul_id)
            throw new Error('Soul ID required');
        if (!soul.soul_version)
            throw new Error('Soul version required');
        if (!soul.identity)
            throw new Error('Soul identity required');
        return soul;
    }
    static validateGate(data) {
        const gate = data;
        if (!gate.id)
            throw new Error('Gate ID required');
        if (!gate.phase)
            throw new Error('Gate phase required');
        if (!gate.checkItems)
            throw new Error('Gate check items required');
        return gate;
    }
    static isValidSoul(data) {
        try {
            SchemaValidator.validateSoul(data);
            return true;
        }
        catch {
            return false;
        }
    }
    static isValidGate(data) {
        try {
            SchemaValidator.validateGate(data);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=SchemaValidator.js.map