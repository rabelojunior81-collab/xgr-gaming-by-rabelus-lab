import { Logger } from '../utils/logger.js';
export async function initCommand(options) {
    Logger.heading('RQP Init');
    if (!options.name) {
        Logger.error('Nome do projeto é obrigatório');
        Logger.info('Use: rqp init --name <nome>');
        process.exit(1);
    }
    Logger.info(`Inicializando projeto: ${options.name}`);
    Logger.info(`Template: ${options.template}`);
    // TODO: Implementar criação de projeto
    Logger.warn('Comando init em desenvolvimento');
    Logger.success('Projeto inicializado!');
}
//# sourceMappingURL=init.js.map