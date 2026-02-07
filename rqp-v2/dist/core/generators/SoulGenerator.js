export class SoulGenerator {
    generate(params) {
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
    generateProjectSoul(data) {
        return {
            soul_id: `project-${Date.now()}`,
            soul_version: '2.0.0',
            identity: {
                code: 'PROJECT',
                name: data.name,
                type: 'Central',
                level: 0,
                description: data.description || `Project ${data.name}`,
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
    generateStakeholderSoul(data) {
        return {
            soul_id: `stakeholder-${Date.now()}`,
            soul_version: '2.0.0',
            identity: {
                code: 'STAKEHOLDER',
                name: data.name,
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
    generateAgentSoul(data) {
        return {
            soul_id: `agent-${data.code}-${Date.now()}`,
            soul_version: '2.0.0',
            identity: {
                code: data.code,
                name: data.name,
                type: data.type,
                level: data.level,
                description: data.description,
            },
            genome: {
                capabilities: data.capabilities || [],
                limits: data.limits || [],
            },
        };
    }
}
//# sourceMappingURL=SoulGenerator.js.map