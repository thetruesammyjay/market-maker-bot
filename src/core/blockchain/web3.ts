import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { initializeJito } from './jito';
import { initializeJupiter } from './jupiter';
import { initializeRaydium } from './raydium';

export class SolanaManager {
    public connection: Connection;
    private _jito: any;
    private _jupiter: any;
    private _raydium: any;

    constructor(rpcUrl: string) {
        this.connection = new Connection(rpcUrl, {
            commitment: 'confirmed',
            wsEndpoint: rpcUrl.replace('https', 'wss')
        });
    }

    async initialize() {
        this._jito = await initializeJito(this.connection);
        this._jupiter = await initializeJupiter(this.connection);
        this._raydium = initializeRaydium(this.connection);
    }

    get jito() {
        if (!this._jito) throw new Error('JITO not initialized');
        return this._jito;
    }

    get jupiter() {
        if (!this._jupiter) throw new Error('Jupiter not initialized');
        return this._jupiter;
    }

    get raydium() {
        if (!this._raydium) throw new Error('Raydium not initialized');
        return this._raydium;
    }

    async getBalance(publicKey: PublicKey): Promise<number> {
        return this.connection.getBalance(publicKey);
    }

    async getRecentBlockhash(): Promise<string> {
        return (await this.connection.getRecentBlockhash()).blockhash;
    }
}