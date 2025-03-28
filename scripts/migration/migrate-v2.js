// Database migration script
const fs = require('fs');
const { WalletEncryptor } = require('../../src/services/wallet/keyManagement/encryption');

async function migrate() {
  const encryptor = new WalletEncryptor(process.env.ENCRYPTION_SECRET);
  const oldWallets = JSON.parse(fs.readFileSync('./old-wallets.json'));
  
  for (const wallet of oldWallets) {
    const encrypted = await encryptor.encryptData(wallet.privateKey);
    fs.writeFileSync(`../wallet-storage/${wallet.name}.json`, JSON.stringify({
      publicKey: wallet.publicKey,
      encryptedSecret: encrypted,
      createdAt: new Date().toISOString()
    }));
  }
}

migrate().catch(console.error);