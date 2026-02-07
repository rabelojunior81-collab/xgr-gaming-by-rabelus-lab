import { Gate, GateResult, GatePhase } from '../../types/index.js';
export interface GateContext {
    projectPath: string;
    autoChecks?: Record<string, boolean>;
    manualConfirmations?: Record<string, boolean>;
    evidence?: Record<string, string>;
}
export declare class GateManager {
    private gates;
    constructor();
    private initializeGates;
    getGate(id: string): Gate | undefined;
    getAllGates(): Gate[];
    getGatesByPhase(phase: GatePhase): Gate[];
    runGate(gateId: string, context: GateContext): Promise<GateResult>;
    private evaluateItem;
    private checkMandatoryItems;
}
//# sourceMappingURL=GateManager.d.ts.map