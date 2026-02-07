import chalk from 'chalk';
export class Logger {
    static level = 'info';
    static verbose = false;
    static setLevel(level) {
        Logger.level = level;
    }
    static setVerbose(verbose) {
        Logger.verbose = verbose;
    }
    static debug(message) {
        if (Logger.level === 'debug' || Logger.verbose) {
            console.log(chalk.gray(`[DEBUG] ${message}`));
        }
    }
    static info(message) {
        if (['debug', 'info'].includes(Logger.level)) {
            console.log(chalk.blue(`[INFO] ${message}`));
        }
    }
    static success(message) {
        console.log(chalk.green(`✓ ${message}`));
    }
    static warn(message) {
        if (['debug', 'info', 'warn'].includes(Logger.level)) {
            console.log(chalk.yellow(`⚠ ${message}`));
        }
    }
    static error(message) {
        console.error(chalk.red(`✗ ${message}`));
    }
    static heading(title) {
        console.log('\n' + chalk.bold.cyan(`═══ ${title} ═══`));
    }
    static box(content) {
        const width = Math.max(...content.map(line => line.length)) + 4;
        const top = '┌' + '─'.repeat(width - 2) + '┐';
        const bottom = '└' + '─'.repeat(width - 2) + '┘';
        console.log(chalk.cyan(top));
        content.forEach(line => {
            const padding = ' '.repeat(width - line.length - 2);
            console.log(chalk.cyan('│ ') + line + padding + chalk.cyan('│'));
        });
        console.log(chalk.cyan(bottom));
    }
}
//# sourceMappingURL=logger.js.map