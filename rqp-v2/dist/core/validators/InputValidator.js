import { resolve, normalize } from 'path';
export class InputValidator {
    static ALLOWED_COMMANDS = ['git', 'npm', 'yarn', 'pnpm', 'npx', 'node'];
    static validateProjectPath(input) {
        try {
            const resolved = resolve(input);
            const normalized = normalize(resolved);
            if (normalized.includes('..')) {
                return { valid: false, error: 'Path traversal detected' };
            }
            if (/[<>:"|?*]/.test(input)) {
                return { valid: false, error: 'Invalid characters in path' };
            }
            return { valid: true, path: resolved };
        }
        catch {
            return { valid: false, error: 'Invalid path format' };
        }
    }
    static validateAgentCode(code) {
        const validCodes = [
            'ORCH-000', 'DISC-001', 'SPEC-001', 'ARCH-001',
            'IMPL-001', 'VALD-001', 'RETR-001', 'BUGF-001', 'SECR-001'
        ];
        return validCodes.includes(code);
    }
    static validateShellCommand(cmd) {
        const baseCmd = cmd.split(' ')[0].toLowerCase();
        if (!this.ALLOWED_COMMANDS.includes(baseCmd)) {
            return {
                valid: false,
                error: `Command '${baseCmd}' not allowed`
            };
        }
        return { valid: true };
    }
}
//# sourceMappingURL=InputValidator.js.map