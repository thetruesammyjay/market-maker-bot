import { Keypair } from '@solana/web3.js';
import { KeyEncryptor } from './encryption';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface WalletConfig {
    publicKey: string;
    encryptedSecret: string;
    createdAt: string;
    lastUsed?: string;
}

export class KeyStorage {
    private readonly storagePath: string;

    constructor(
        private encryptor: KeyEncryptor,
        storagePath: string = './wallet-storage'
    ) {
        this.storagePath = storagePath;
        if (!existsSync(storagePath)) {
            mkdirSync(storagePath, { recursive: true });
        }
    }

    async saveWallet(keypair: Keypair, name: string = 'default'): Promise<void> {
        const encrypted = await this.encryptor.encryptKeypair(keypair);
        const config: WalletConfig = {
            publicKey: keypair.publicKey.toString(),
            encryptedSecret: encrypted,
            createdAt: new Date().toISOString()
        };

        writeFileSync(
            join(this.storagePath, `${name}.json`),
            JSON.stringify(config, null, 2)
        );
    }

    async loadWallet(name: string = 'default'): Promise<Keypair | null> {
        const filePath = join(this.storagePath, `${name}.json`);
        if (!existsSync(filePath)) return null;

        const config: WalletConfig = JSON.parse(
            readFileSync(filePath, 'utf-8')
        );

        // Update last used timestamp
        config.lastUsed = new Date().toISOString();
        writeFileSync(filePath, JSON.stringify(config, null, 2));

        return this.encryptor.decryptKeypair(config.encryptedSecret);
    }

    listWallets(): string[] {
        if (!existsSync(this.storagePath)) return [];
        return require('fs')
            .readdirSync(this.storagePath)
            .filter((file: string) => file.endsWith('.json'))
            .map((file: string) => file.replace('.json', ''));
    }
}