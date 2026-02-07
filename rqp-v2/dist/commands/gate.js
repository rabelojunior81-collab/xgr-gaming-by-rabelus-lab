import { Logger } from '../utils/logger.js';
const gates = [
    { id: 'SG-001', phase: 'discovery', name: 'Discovery Gate', checklists: 5 },
    { id: 'SG-002', phase: 'specification', name: 'Specification Gate', checklists: 7 },
    { id: 'SG-003', phase: 'architect', name: 'Architect Gate', checklists: 6 },
    { id: 'SG-004', phase: 'implementation', name: 'Implementation Gate', checklists: 8 },
    { id: 'SG-005', phase: 'validation', name: 'Validation Gate', checklists: 7 },
    { id: 'SG-006', phase: 'release', name: 'Release Gate', checklists: 6 },
];
export async function gateCommand(command, options) {
    Logger.heading('RQP Gates');
    switch (command) {
        case 'list':
            console.log('\nGates de qualidade:');
            gates.forEach(gate => {
                console.log(`  ${gate.id} - ${gate.name} (${gate.checklists} checklists)`);
            });
            break;
        case 'run':
            if (!options.phase) {
                Logger.error('Fase é obrigatória');
                Logger.info('Use: rqp gate run --phase discovery');
                process.exit(1);
            }
            const gate = gates.find(g => g.phase === options.phase);
            if (!gate) {
                Logger.error(`Fase desconhecida: ${options.phase}`);
                process.exit(1);
            }
            Logger.success(`Gate ${gate.id} executado`);
            Logger.info(`Fase: ${gate.phase}`);
            Logger.info(`Checklists: ${gate.checklists}`);
            break;
        case 'status':
            console.log('\nStatus dos Gates:');
            gates.forEach(gate => {
                const status = gate.id === 'SG-001' ? '⏳ Pendente' : '🔒 Bloqueado';
                console.log(`  ${gate.id}: ${status}`);
            });
            break;
        default:
            Logger.error(`Comando desconhecido: ${command}`);
            Logger.info('Comandos disponíveis: list, run, status');
    }
}
//# sourceMappingURL=gate.js.map