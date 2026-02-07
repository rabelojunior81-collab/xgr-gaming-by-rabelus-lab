import { Soul } from '../../types/index.js';
export interface SoulGenerationParams {
    type: 'project' | 'stakeholder' | 'agent';
    data: Record<string, unknown>;
}
export declare class SoulGenerator {
    generate(params: SoulGenerationParams): Soul;
    private generateProjectSoul;
    private generateStakeholderSoul;
    private generateAgentSoul;
}
//# sourceMappingURL=SoulGenerator.d.ts.map