import { AuditReport } from '../../types/index.js';
export declare class AuditEngine {
    analyze(projectPath: string): Promise<AuditReport>;
    private detectStack;
    private detectArchitecture;
    private analyzeDependencies;
    private analyzeCodeMetrics;
}
//# sourceMappingURL=AuditEngine.d.ts.map