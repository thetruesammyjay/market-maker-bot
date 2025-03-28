import { AxiosError } from 'axios';
import { Connection, SendTransactionError } from '@solana/web3.js';
import { Logger } from './logger';

export class ServiceErrorHandler {
    private static logger = new Logger('ErrorHandler');

    static handleApiError(error: unknown): never {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            const data = error.response?.data;
            
            this.logger.error(`API Error - Status: ${status}`, data);
            throw new Error(`API request failed: ${error.message}`);
        }

        this.logger.error('Unknown API error', error);
        throw new Error('Unknown API error occurred');
    }

    static handleBlockchainError(error: unknown): never {
        if (error instanceof SendTransactionError) {
            this.logger.error('Transaction failed', {
                message: error.message,
                logs: error.logs
            });
            throw new Error(`Transaction failed: ${error.message}`);
        }

        if (error instanceof Error && 'code' in error) {
            this.logger.error('Blockchain RPC error', {
                code: (error as any).code,
                message: error.message
            });
            throw new Error(`Blockchain error: ${error.message}`);
        }

        this.logger.error('Unknown blockchain error', error);
        throw new Error('Unknown blockchain error occurred');
    }

    static handleWalletError(error: unknown): never {
        this.logger.error('Wallet operation failed', error);
        throw new Error('Wallet operation failed - check logs for details');
    }

    static handleRateLimitError(service: string): never {
        this.logger.warn(`Rate limit exceeded for ${service}`);
        throw new Error(`Too many requests to ${service}. Please wait and try again.`);
    }

    static handleCriticalError(error: unknown): never {
        this.logger.fatal('Critical error occurred', error);
        process.exit(1);
    }
}

export class Logger {
    constructor(private context: string) {}

    log(message: string, meta?: any) {
        console.log(`[${new Date().toISOString()}] [${this.context}] ${message}`, meta);
    }

    error(message: string, error?: any) {
        console.error(`[${new Date().toISOString()}] [${this.context}] ERROR: ${message}`, error);
    }

    warn(message: string, meta?: any) {
        console.warn(`[${new Date().toISOString()}] [${this.context}] WARN: ${message}`, meta);
    }

    fatal(message: string, error?: any) {
        console.error(`[${new Date().toISOString()}] [${this.context}] FATAL: ${message}`, error);
    }
}