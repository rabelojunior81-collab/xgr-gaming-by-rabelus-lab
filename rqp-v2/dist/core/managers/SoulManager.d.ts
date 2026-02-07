import { Soul, AgentCode } from '../../types/index.js';
export declare class SoulManager {
    private projectPath;
    constructor(projectPath: string);
    loadSoul(type: 'project' | 'stakeholder'): Promise<Soul>;
    loadAgentSoul(code: AgentCode): Promise<Soul>;
    saveSoul(soul: Soul, type: 'project' | 'stakeholder' | 'agent'): Promise<void>;
    private getSoulPath;
    private createDefaultAgentSoul;
}
//# sourceMappingURL=SoulManager.d.ts.map