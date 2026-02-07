import { SoulManager } from './SoulManager.js';
export class AgentManager {
    currentAgent = null;
    agents = new Map();
    soulManager;
    constructor(projectPath) {
        this.soulManager = new SoulManager(projectPath);
    }
    async loadAgent(code) {
        // In real implementation, load from soul file
        const agentNames = {
            'ORCH-000': 'Orchestrator',
            'DISC-001': 'Discovery Agent',
            'SPEC-001': 'Specification Agent',
            'ARCH-001': 'Architect Agent',
            'IMPL-001': 'Implementation Agent',
            'VALD-001': 'Validation Agent',
            'RETR-001': 'Retrospective Agent',
            'BUGF-001': 'Bugfix Agent',
            'SECR-001': 'Security Agent',
        };
        const agent = {
            code,
            name: agentNames[code],
            status: 'idle',
            soul: await this.soulManager.loadAgentSoul(code),
        };
        this.agents.set(code, agent);
        return agent;
    }
    async activateAgent(code) {
        if (this.currentAgent) {
            const current = this.agents.get(this.currentAgent);
            if (current) {
                current.status = 'completed';
            }
        }
        const agent = await this.loadAgent(code);
        agent.status = 'active';
        this.currentAgent = code;
        return agent;
    }
    async handoff(context) {
        if (this.currentAgent !== context.from) {
            throw new Error(`Current agent is ${this.currentAgent}, not ${context.from}`);
        }
        console.log(`Handoff: ${context.from} → ${context.to}`);
        console.log(`Reason: ${context.reason}`);
        await this.activateAgent(context.to);
    }
    getCurrentAgent() {
        return this.currentAgent;
    }
    getAgentStatus(code) {
        return this.agents.get(code);
    }
    getAllAgents() {
        return Array.from(this.agents.values());
    }
}
//# sourceMappingURL=AgentManager.js.map