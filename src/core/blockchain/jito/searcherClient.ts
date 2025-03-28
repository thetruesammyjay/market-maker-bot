import { SearcherClient } from 'jito-ts/dist/sdk/block-engine/searcher';
import { Connection } from '@solana/web3.js';

export class JitoSearcher {
    private client: SearcherClient;
    private connected: boolean = false;

    constructor(
        private readonly endpoint: string,
        private readonly authKey: string,
        private readonly connection: Connection
    ) {
        this.client = new SearcherClient(endpoint, authKey);
    }

    async connect(): Promise<void> {
        if (!this.connected) {
            await this.client.connect();
            this.connected = true;
        }
    }

    async sendBundle(bundle: any): Promise<string> {
        if (!this.connected) {
            await this.connect();
        }
        return this.client.sendBundle(bundle);
    }

    async simulateBundle(bundle: any): Promise<any> {
        if (!this.connected) {
            await this.connect();
        }
        return this.client.simulateBundle(bundle);
    }

    getTipAccount(): string {
        return this.client.getTipAccount();
    }
}