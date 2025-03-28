import { SolanaManager } from '../blockchain/web3';
import { initializeExecution } from './execution';
import { initializeMonitoring } from './monitoring';
import { initializeStrategies } from './strategies';

export class TradingEngine {
    public execution: ReturnType<typeof initializeExecution>;
    public monitoring: ReturnType<typeof initializeMonitoring>;
    public strategies: ReturnType<typeof initializeStrategies>;

    constructor(solana: SolanaManager) {
        this.execution = initializeExecution(solana);
        this.monitoring = initializeMonitoring(solana);
        this.strategies = initializeStrategies(solana);
    }

    async start() {
        console.log('Trading engine started');
    }

    async stop() {
        console.log('Trading engine stopped');
    }
}