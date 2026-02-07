import { AgentCode } from '../../types/index.js';
export declare class InputValidator {
    private static ALLOWED_COMMANDS;
    static validateProjectPath(input: string): {
        valid: boolean;
        error?: string;
        path?: string;
    };
    static validateAgentCode(code: string): code is AgentCode;
    static validateShellCommand(cmd: string): {
        valid: boolean;
        error?: string;
    };
}
//# sourceMappingURL=InputValidator.d.ts.map