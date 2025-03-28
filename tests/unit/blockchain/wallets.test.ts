import { KeyEncryptor } from '../../../src/services/wallet/keyManagement/encryption';
import { Keypair } from '@solana/web3.js';

describe('Wallet Encryption', () => {
  const encryptor = new KeyEncryptor('test-encryption-secret-32-characters-long');

  it('should encrypt and decrypt keypair', async () => {
    const keypair = Keypair.generate();
    const encrypted = await encryptor.encryptKeypair(keypair);
    const decrypted = await encryptor.decryptKeypair(encrypted);

    expect(decrypted.publicKey.toBase58()).toEqual(keypair.publicKey.toBase58());
    expect(decrypted.secretKey).toEqual(keypair.secretKey);
  });

  it('should fail with invalid encryption key', async () => {
    const badEncryptor = new KeyEncryptor('too-short');
    await expect(badEncryptor.encryptKeypair(Keypair.generate()))
      .rejects
      .toThrow('Encryption secret must be at least 32 characters');
  });
});