
import { FileSystem, getStatePath, getRQPPath } from '../utils/fileSystem.js';
import { Logger } from '../utils/logger.js';
import { ProjectStatus } from '../types/index.js';

interface StatusOptions {
  verbose?: boolean;
  json?: boolean;
}

export async function statusCommand(options: StatusOptions): Promise<void> {
  try {
    const projectPath = process.cwd();
    const rqpPath = getRQPPath(projectPath);
    const statePath = getStatePath(projectPath);
    const currentSessionPath = `${statePath}/current-session.json`;

    // Check if RQP is initialized
    if (!await FileSystem.exists(rqpPath)) {
      Logger.error('Projeto RQP não encontrado');
      Logger.info('Execute "rqp onboard" para inicializar');
      process.exit(1);
    }

    // Read current session
    if (!await FileSystem.exists(currentSessionPath)) {
      Logger.error('Estado do projeto não encontrado');
      process.exit(1);
    }

    const status = await FileSystem.readJson<ProjectStatus>(currentSessionPath);

    if (options.json) {
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    // Display status
    Logger.heading('RQP Project Status');
    
    const lines = [
      `Project: ${status.projectName}`,
      `Current Phase: ${getPhaseName(status.currentPhase)}`,
      `Active Agent: ${status.currentAgent}`,
      `Gates: ${status.gatesCompleted}/${status.totalGates} completed`,
      `Last Updated: ${new Date(status.lastUpdated).toLocaleString()}`,
    ];

    Logger.box(lines);

    // Show next steps
    console.log('\n' + chalk.bold('Próximos Passos:'));
    const nextSteps = getNextSteps(status);
    nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    if (options.verbose) {
      console.log('\n' + chalk.bold('Caminhos:'));
      console.log(`  RQP: ${rqpPath}`);
      console.log(`  State: ${statePath}`);
    }

  } catch (error) {
    Logger.error(`Erro ao obter status: ${(error as Error).message}`);
    process.exit(1);
  }
}

function getPhaseName(phase: string): string {
  const phases: Record<string, string> = {
    'discovery': '1 - Discovery',
    'specification': '2 - Specification',
    'architect': '3 - Architect',
    'implementation': '4 - Implementation',
    'validation': '5 - Validation',
    'release': '6 - Release',
  };
  return phases[phase] || phase;
}

function getNextSteps(status: ProjectStatus): string[] {
  const steps: string[] = [];
  
  if (status.gatesCompleted < status.totalGates) {
    steps.push(`Complete a fase atual: ${getPhaseName(status.currentPhase)}`);
    steps.push(`Execute: rqp gate run --phase=${status.currentPhase}`);
  }
  
  if (status.currentAgent !== 'IMPL-001') {
    steps.push(`Transfira para o próximo agente quando apropriado`);
    steps.push(`Execute: rqp agent handoff --from=${status.currentAgent} --to=<next>`);
  }
  
  steps.push('Verifique gates pendentes: rqp gate list');
  
  return steps;
}

import chalk from 'chalk';
