import { Connection, Keypair } from '@solana/web3.js';
import { KeyEncryptor } from './keyManagement/encryption';
import { KeyStorage } from './keyManagement/storage';
import { KeyRecovery } from './keyManagement/recovery';
import { TokenBalanceTracker } from './balance/tokenBalance';
import { SOLBalanceTracker } from './balance/solBalance';
import { PortfolioValuator } from './balance/valueCalculator';

export class WalletService {
    public readonly encryption: KeyEncryptor;
    public readonly storage: KeyStorage;
    public readonly recovery: KeyRecovery;
    public readonly tokens: TokenBalanceTracker;
    public readonly sol: SOLBalanceTracker;
    public readonly portfolio: PortfolioValuator;

    private currentKeypair?: Keypair;

    constructor(
        connection: Connection,
        priceFeed: (mint: string) => Promise<number>,
        encryptionSecret: string
    ) {
        this.encryption = new KeyEncryptor(encryptionSecret);
        this.storage = new KeyStorage(this.encryption);
        this.recovery = new KeyRecovery(this.encryption);
        this.tokens = new TokenBalanceTracker(connection);
        this.sol = new SOLBalanceTracker(connection);
        this.portfolio = new PortfolioValuator(
            this.sol,
            this.tokens,
            priceFeed
        );
    }

    get publicKey(): string | undefined {
        return this.currentKeypair?.publicKey.toString();
    }

    async setWallet(keypair: Keypair): Promise<void> {
        this.currentKeypair = keypair;
    }

    async loadFromStorage(name: string = 'default'): Promise<boolean> {
        const keypair = await this.storage.loadWallet(name);
        if (!keypair) return false;
        this.currentKeypair = keypair;
        return true;
    }

    async saveToStorage(name: string = 'default'): Promise<void> {
        if (!this.currentKeypair) {
            throw new Error('No wallet currently set');
        }
        await this.storage.saveWallet(this.currentKeypair, name);
    }

    async generateRecoveryKit(password: string): Promise<string> {
        if (!this.currentKeypair) {
            throw new Error('No wallet currently set');
        }
        return this.recovery.createRecoveryKit(this.currentKeypair, password);
    }
}