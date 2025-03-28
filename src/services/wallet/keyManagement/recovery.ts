import { Keypair } from '@solana/web3.js';
import { KeyEncryptor } from './encryption';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';

export class KeyRecovery {
    constructor(private encryptor: KeyEncryptor) {}

    generateMnemonic(): string {
        const bip39 = require('bip39');
        return bip39.generateMnemonic(256);
    }

    keypairFromMnemonic(mnemonic: string, index = 0): Keypair {
        const seed = mnemonicToSeedSync(mnemonic);
        const path = `m/44'/501'/${index}'/0'`;
        const derived = derivePath(path, seed.toString('hex')).key;
        return Keypair.fromSeed(derived);
    }

    createRecoveryKit(keypair: Keypair, password: string): string {
        const recoveryData = {
            publicKey: keypair.publicKey.toString(),
            mnemonic: this.generateMnemonic(),
            encryptedHint: this.encryptor.encryptData(
                `Recovery password hint: ${password.substring(0, 3)}...`
            ),
            createdAt: new Date().toISOString()
        };

        const tempPath = join(__dirname, 'recovery-kit.json');
        writeFileSync(tempPath, JSON.stringify(recoveryData, null, 2));
        return tempPath;
    }
}