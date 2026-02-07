import { FileSystem, getSoulsPath } from '../../utils/fileSystem.js';
import { join } from 'path';
export class SoulManager {
    projectPath;
    constructor(projectPath) {
        this.projectPath = projectPath;
    }
    async loadSoul(type) {
        const soulPath = this.getSoulPath(type);
        return FileSystem.readJson(soulPath);
    }
    async loadAgentSoul(code) {
        const soulPath = join(getSoulsPath(this.projectPath), 'agents', `${code.toLowerCase()}.soul.json`);
        // Return default agent soul if not found
        try {
            return await FileSystem.readJson(soulPath);
        }
        catch {
            return this.createDefaultAgentSoul(code);
        }
    }
    async saveSoul(soul, type) {
        const soulPath = this.getSoulPath(type, type === 'agent' ? soul.identity.code : undefined);
        await FileSystem.ensureDir(join(soulPath, '..'));
        await FileSystem.writeJson(soulPath, soul);
    }
    getSoulPath(type, code) {
        const soulsPath = getSoulsPath(this.projectPath);
        switch (type) {
            case 'project':
                return join(soulsPath, 'project.soul.json');
            case 'stakeholder':
                return join(soulsPath, 'stakeholder.soul.json');
            case 'agent':
                if (!code)
                    throw new Error('Agent code required');
                return join(soulsPath, 'agents', `${code.toLowerCase()}.soul.json`);
        }
    }
    createDefaultAgentSoul(code) {
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
        return {
            soul_id: `agent-${code.toLowerCase()}-${Date.now()}`,
            soul_version: '2.0.0',
            identity: {
                code,
                name: agentNames[code],
                type: 'Execucao',
                level: 1,
                description: `${agentNames[code]} for RQP`,
            },
            genome: {
                capabilities: [],
                limits: [],
            },
        };
    }
}
//# sourceMappingURL=SoulManager.js.map