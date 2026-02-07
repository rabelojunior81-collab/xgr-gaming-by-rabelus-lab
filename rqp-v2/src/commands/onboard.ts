import { FileSystem, getRQPPath, getSoulsPath, getStatePath, getProtocolsPath } from '../utils/fileSystem.js';
import { Logger } from '../utils/logger.js';
import { join, resolve } from 'path';
import { ProjectStatus, Soul } from '../types/index.js';

interface OnboardOptions {
  project?: string;
  analyze?: boolean;
  quiz?: boolean;
  depth?: string;
}

export async function onboardCommand(options: OnboardOptions): Promise<void> {
  try {
    const projectPath = options.project || './';
    const resolvedPath = resolve(projectPath);
    
    Logger.heading('RQP Onboarding');
    Logger.info(`Projeto: ${resolvedPath}`);

    // Check if already onboarded
    const rqpPath = getRQPPath(resolvedPath);
    if (await FileSystem.exists(rqpPath)) {
      Logger.warn('Projeto já possui estrutura RQP');
      const { overwrite } = await import('enquirer').then(m => {
        const { prompt } = m.default;
        return prompt<{ overwrite: boolean }>({
          type: 'confirm',
          name: 'overwrite',
          message: 'Deseja sobrescrever?',
          initial: false
        });
      });
      
      if (!overwrite) {
        Logger.info('Onboarding cancelado');
        return;
      }
    }

    // Create directory structure
    Logger.info('Criando estrutura RQP...');
    await FileSystem.ensureDir(getSoulsPath(resolvedPath));
    await FileSystem.ensureDir(join(getSoulsPath(resolvedPath), 'agents'));
    await FileSystem.ensureDir(getStatePath(resolvedPath));
    await FileSystem.ensureDir(getProtocolsPath(resolvedPath));

    // Detect project info
    const projectName = await detectProjectName(resolvedPath);
    Logger.info(`Nome detectado: ${projectName}`);

    // Create Project Soul
    const projectSoul: Soul = {
      soul_id: `project-${Date.now()}`,
      soul_version: '2.0.0',
      identity: {
        code: 'PROJECT',
        name: projectName,
        type: 'Central',
        level: 0,
        description: `Projeto ${projectName}`,
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

    await FileSystem.writeJson(
      join(getSoulsPath(resolvedPath), 'project.soul.json'),
      projectSoul
    );
    Logger.success('Project Soul criado');

    // Create Stakeholder Soul (default)
    const stakeholderSoul: Soul = {
      soul_id: `stakeholder-${Date.now()}`,
      soul_version: '2.0.0',
      identity: {
        code: 'STAKEHOLDER',
        name: 'Developer',
        type: 'Central',
        level: 0,
        description: 'Stakeholder principal',
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

    await FileSystem.writeJson(
      join(getSoulsPath(resolvedPath), 'stakeholder.soul.json'),
      stakeholderSoul
    );
    Logger.success('Stakeholder Soul criado');

    // Create initial state
    const state: ProjectStatus = {
      projectName,
      currentPhase: 'discovery',
      currentAgent: 'ORCH-000',
      gatesCompleted: 0,
      totalGates: 6,
      lastUpdated: new Date(),
    };

    await FileSystem.writeJson(
      join(getStatePath(resolvedPath), 'current-session.json'),
      state
    );
    Logger.success('Estado inicial criado');

    // Success message
    Logger.box([
      'RQP Onboarding Completo!',
      '',
      `Projeto: ${projectName}`,
      `Fase: Discovery`,
      `Agente: ORCH-000`,
    ]);

    Logger.info('\nPróximos passos:');
    Logger.info('  1. rqp status - Verificar status');
    Logger.info('  2. rqp gate list - Listar gates');
    Logger.info('  3. rqp gate run --phase=discovery - Iniciar Discovery');

  } catch (error) {
    Logger.error(`Erro no onboarding: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function detectProjectName(projectPath: string): Promise<string> {
  try {
    // Try to read package.json
    const packagePath = join(projectPath, 'package.json');
    if (await FileSystem.exists(packagePath)) {
      const pkg = await FileSystem.readJson<{ name?: string }>(packagePath);
      if (pkg.name) return pkg.name;
    }
  } catch {
    // Ignore
  }

  // Fallback to directory name
  return projectPath.split(/[/\\]/).pop() || 'unknown-project';
}
