import chalk from 'chalk';
import { LogLevel } from '../types/index.js';

export class Logger {
  private static level: LogLevel = 'info';
  private static verbose = false;

  static setLevel(level: LogLevel): void {
    Logger.level = level;
  }

  static setVerbose(verbose: boolean): void {
    Logger.verbose = verbose;
  }

  static debug(message: string): void {
    if (Logger.level === 'debug' || Logger.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }

  static info(message: string): void {
    if (['debug', 'info'].includes(Logger.level)) {
      console.log(chalk.blue(`[INFO] ${message}`));
    }
  }

  static success(message: string): void {
    console.log(chalk.green(`✓ ${message}`));
  }

  static warn(message: string): void {
    if (['debug', 'info', 'warn'].includes(Logger.level)) {
      console.log(chalk.yellow(`⚠ ${message}`));
    }
  }

  static error(message: string): void {
    console.error(chalk.red(`✗ ${message}`));
  }

  static heading(title: string): void {
    console.log('\n' + chalk.bold.cyan(`═══ ${title} ═══`));
  }

  static box(content: string[]): void {
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
