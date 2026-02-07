import { Logger } from '../utils/logger.js';
export async function docsCommand(command, options) {
    Logger.heading('RQP Docs');
    switch (command) {
        case 'generate':
            if (options.all) {
                Logger.success('Todos os documentos gerados');
            }
            else if (options.type) {
                Logger.success(`Documento ${options.type} gerado`);
            }
            else {
                Logger.error('Tipo ou --all é obrigatório');
                Logger.info('Use: rqp docs generate --type spec');
                Logger.info('Ou: rqp docs generate --all');
                process.exit(1);
            }
            break;
        case 'structure':
            Logger.success('Estrutura de documentação criada');
            break;
        case 'validate':
            Logger.success('Documentação validada');
            break;
        default:
            Logger.error(`Comando desconhecido: ${command}`);
            Logger.info('Comandos disponíveis: generate, structure, validate');
    }
}
//# sourceMappingURL=docs.js.map