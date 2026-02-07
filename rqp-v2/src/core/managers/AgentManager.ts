import { Agent, AgentCode, HandoffContext } from '../../types/index.js';
import { SoulManager } from './SoulManager.js';

export class AgentManager {
  private currentAgent: AgentCode | null = null;
  private agents: Map<AgentCode, Agent> = new Map();
  private soulManager: SoulManager;

  constructor(projectPath: string) {
    this.soulManager = new SoulManager(projectPath);
  }

  async loadAgent(code: AgentCode): Promise<Agent> {
    // In real implementation, load from soul file
    const agentNames: Record<AgentCode, string> = {
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

    const agent: Agent = {
      code,
      name: agentNames[code],
      status: 'idle',
      soul: await this.soulManager.loadAgentSoul(code),
    };

    this.agents.set(code, agent);
    return agent;
  }

  async activateAgent(code: AgentCode): Promise<Agent> {
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

  async handoff(context: HandoffContext): Promise<void> {
    if (this.currentAgent !== context.from) {
      throw new Error(`Current agent is ${this.currentAgent}, not ${context.from}`);
    }

    console.log(`Handoff: ${context.from} → ${context.to}`);
    console.log(`Reason: ${context.reason}`);

    await this.activateAgent(context.to);
  }

  getCurrentAgent(): AgentCode | null {
    return this.currentAgent;
  }

  getAgentStatus(code: AgentCode): Agent | undefined {
    return this.agents.get(code);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}
