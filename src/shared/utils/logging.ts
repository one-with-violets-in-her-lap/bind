export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

interface LoggerConfig {
    level: LogLevel
}

let sharedConfig: LoggerConfig = { level: LogLevel.WARN }

export function configureLoggers(config: LoggerConfig) {
    sharedConfig = config
}

export class Logger {
    constructor(private readonly name: string) {}

    debug(...message: any[]) {
        if (sharedConfig.level <= LogLevel.DEBUG) {
            console.debug(...this.formatMessage('DEBUG', ...message))
        }
    }

    info(...message: any[]) {
        if (sharedConfig.level <= LogLevel.INFO) {
            console.info(...this.formatMessage('INFO', ...message))
        }
    }

    warn(...message: any[]) {
        if (sharedConfig.level <= LogLevel.WARN) {
            console.warn(...this.formatMessage('WARN', ...message))
        }
    }

    error(...message: any[]) {
        if (sharedConfig.level <= LogLevel.ERROR) {
            console.error(...this.formatMessage('ERROR', ...message))
        }
    }

    private formatMessage(level: string, ...message: any[]): string[] {
        const timestamp = new Date().toISOString()

        return [
            '%cBind',
            'color: white; font-style: italic; background-color: rgb(40,40,40); padding: 2px 5px; border-radius: 5px;',
            `[${timestamp}] ${level} [${this.name}]:`,
            ...message,
        ]
    }
}
