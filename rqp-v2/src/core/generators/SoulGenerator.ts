import { Soul } from '../../types/index.js';

export interface SoulGenerationParams {
  type: 'project' | 'stakeholder' | 'agent';
  data: Record<string, unknown>;
}

export class SoulGenerator {
  generate(params: SoulGenerationParams): Soul {
    switch (params.type) {
      case 'project':
        return this.generateProjectSoul(params.data);
      case 'stakeholder':
        return this.generateStakeholderSoul(params.data);
      case 'agent':
        return this.generateAgentSoul(params.data);
      default:
        throw new Error(`Unknown soul type: ${params.type}`);
    }
  }

  private generateProjectSoul(data: Record<string, unknown>): Soul {
    return {
      soul_id: `project-${Date.now()}`,
      soul_version: '2.0.0',
      identity: {
        code: 'PROJECT',
        name: data.name as string,
        type: 'Central',
        level: 0,
        description: data.description as string || `Project ${data.name}`,
      },
      genome: {
        capabilities: [
          {
            id: 'PROJ-CAP-001',
            description: 'Manage project lifecycle through RQP phases',
            skills: ['lifecycle-management', 'phase-transition'],
          },
        ],
        limits: [
          'NUNCA pula gates de segurança',
          'SEMPRE mantém documentação atualizada',
        ],
      },
    };
  }

  private generateStakeholderSoul(data: Record<string, unknown>): Soul {
    return {
      soul_id: `stakeholder-${Date.now()}`,
      soul_version: '2.0.0',
      identity: {
        code: 'STAKEHOLDER',
        name: data.name as string,
        type: 'Central',
        level: 0,
        description: `Stakeholder: ${data.name}`,
      },
      genome: {
        capabilities: [
          {
            id: 'STK-CAP-001',
            description: 'Define project vision and requirements',
            skills: ['vision', 'requirements', 'validation'],
          },
        ],
        limits: ['Autonomia configurada por agente'],
      },
    };
  }

  private generateAgentSoul(data: Record<string, unknown>): Soul {
    return {
      soul_id: `agent-${data.code}-${Date.now()}`,
      soul_version: '2.0.0',
      identity: {
        code: data.code as string,
        name: data.name as string,
        type: data.type as any,
        level: data.level as number,
        description: data.description as string,
      },
      genome: {
        capabilities: (data.capabilities as any[]) || [],
        limits: (data.limits as string[]) || [],
      },
    };
  }
}
