#!/usr/bin/env node
import { Command } from 'commander';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Commands
import { statusCommand } from './commands/status.js';
import { onboardCommand } from './commands/onboard.js';
import { initCommand } from './commands/init.js';
import { agentCommand } from './commands/agent.js';
import { gateCommand } from './commands/gate.js';
import { validateCommand } from './commands/validate.js';
import { soulCommand } from './commands/soul.js';
import { docsCommand } from './commands/docs.js';
import { researchCommand } from './commands/research.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const require = createRequire(import.meta.url);
const packageJson = require(join(__dirname, '../package.json'));

const program = new Command();

program
  .name('rqp')
  .description('Rabelus Quant Protocol - Core Framework v2.0.0')
  .version(packageJson.version);

// Status command
program
  .command('status')
  .description('Mostra status do projeto RQP')
  .option('-v, --verbose', 'Modo verboso')
  .option('--json', 'Saída em JSON')
  .action(statusCommand);

// Onboard command
program
  .command('onboard')
  .description('Adota RQP em projeto existente')
  .option('-p, --project <path>', 'Caminho do projeto', './')
  .option('-a, --analyze', 'Executa análise automática', true)
  .option('-q, --quiz', 'Executa quiz de stakeholder', true)
  .option('-d, --depth <depth>', 'Profundidade da análise', 'medium')
  .action(onboardCommand);

// Init command
program
  .command('init')
  .description('Inicializa um novo projeto com RQP')
  .option('-n, --name <name>', 'Nome do projeto')
  .option('-t, --template <template>', 'Template base', 'react')
  .option('-p, --path <path>', 'Caminho de destino')
  .option('--no-git', 'Não inicializa git')
  .option('--install', 'Instala dependências')
  .action(initCommand);

// Agent command
program
  .command('agent <command>')
  .description('Gerencia agentes RQP (list, activate, status, handoff)')
  .option('-c, --code <code>', 'Código do agente')
  .option('--to <code>', 'Código do agente destino (para handoff)')
  .option('-r, --reason <reason>', 'Razão do handoff')
  .action(agentCommand);

// Gate command
program
  .command('gate <command>')
  .description('Executa gates de qualidade (list, run, status)')
  .option('-p, --phase <phase>', 'Fase do gate')
  .action(gateCommand);

// Validate command
program
  .command('validate')
  .description('Validações de código e qualidade')
  .option('-c, --check <check>', 'Tipo de validação', 'all')
  .option('--fix', 'Tenta corrigir problemas automaticamente')
  .option('--staged', 'Valida apenas arquivos staged')
  .action(validateCommand);

// Soul command
program
  .command('soul <command>')
  .description('Gerencia souls (sync, update, validate, export)')
  .option('-t, --type <type>', 'Tipo de soul')
  .option('-f, --format <format>', 'Formato de exportação', 'json')
  .action(soulCommand);

// Docs command
program
  .command('docs <command>')
  .description('Gera documentação (generate, structure, validate)')
  .option('-t, --type <type>', 'Tipo de documento')
  .option('-a, --all', 'Gera todos os documentos')
  .action(docsCommand);

// Research command
program
  .command('research')
  .description('Pesquisa estruturada')
  .option('-t, --topic <topic>', 'Tema da pesquisa')
  .option('-d, --depth <depth>', 'Profundidade', 'medium')
  .option('-o, --output <path>', 'Arquivo de saída')
  .option('--update', 'Atualiza pesquisas existentes')
  .action(researchCommand);

// Parse arguments
program.parse();

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
