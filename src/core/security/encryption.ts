import { encrypt, decrypt } from '@hapi/iron';
import { Keypair } from '@solana/web3.js';

export class WalletEncryptor {
    private readonly encryptionSecret: string;
    private readonly encryptionOptions = {
        ttl: 0, // No expiration
        algorithm: 'aes-256-cbc',
        saltBits: 256,
        iterations: 1
    };

    constructor(encryptionSecret: string) {
        if (!encryptionSecret || encryptionSecret.length < 32) {
            throw new Error('Encryption secret must be at least 32 characters');
        }
        this.encryptionSecret = encryptionSecret;
    }

    async encryptKeypair(keypair: Keypair): Promise<string> {
        try {
            const secretKey = Buffer.from(keypair.secretKey).toString('hex');
            return await encrypt(secretKey, this.encryptionSecret, this.encryptionOptions);
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    async decryptKeypair(encrypted: string): Promise<Keypair> {
        try {
            const secretKey = await decrypt(encrypted, this.encryptionSecret, this.encryptionOptions);
            return Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'));
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    async encryptData(data: string): Promise<string> {
        return await encrypt(data, this.encryptionSecret, this.encryptionOptions);
    }

    async decryptData(encrypted: string): Promise<string> {
        return await decrypt(encrypted, this.encryptionSecret, this.encryptionOptions);
    }
}