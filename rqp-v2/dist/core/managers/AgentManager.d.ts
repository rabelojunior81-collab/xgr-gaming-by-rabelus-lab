import { Agent, AgentCode, HandoffContext } from '../../types/index.js';
export declare class AgentManager {
    private currentAgent;
    private agents;
    private soulManager;
    constructor(projectPath: string);
    loadAgent(code: AgentCode): Promise<Agent>;
    activateAgent(code: AgentCode): Promise<Agent>;
    handoff(context: HandoffContext): Promise<void>;
    getCurrentAgent(): AgentCode | null;
    getAgentStatus(code: AgentCode): Agent | undefined;
    getAllAgents(): Agent[];
}
//# sourceMappingURL=AgentManager.d.ts.map