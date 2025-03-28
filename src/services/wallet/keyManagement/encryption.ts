import { encrypt, decrypt } from '@hapi/iron';
import { Keypair } from '@solana/web3.js';

export class KeyEncryptor {
    private readonly encryptionSecret: string;
    private readonly encryptionOptions = {
        ttl: 0,
        algorithm: 'aes-256-cbc',
        saltBits: 256,
        iterations: 3
    };

    constructor(encryptionSecret: string) {
        if (encryptionSecret.length < 32) {
            throw new Error('Encryption secret must be at least 32 characters');
        }
        this.encryptionSecret = encryptionSecret;
    }

    async encryptKeypair(keypair: Keypair): Promise<string> {
        const secret = Buffer.from(keypair.secretKey).toString('hex');
        return await encrypt(secret, this.encryptionSecret, this.encryptionOptions);
    }

    async decryptKeypair(encrypted: string): Promise<Keypair> {
        const secret = await decrypt(encrypted, this.encryptionSecret, this.encryptionOptions);
        return Keypair.fromSecretKey(Buffer.from(secret, 'hex'));
    }

    async encryptData(data: string): Promise<string> {
        return await encrypt(data, this.encryptionSecret, this.encryptionOptions);
    }

    async decryptData(encrypted: string): Promise<string> {
        return await decrypt(encrypted, this.encryptionSecret, this.encryptionOptions);
    }
}