#!/bin/bash
# Wallet backup script

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/wallets_$TIMESTAMP"

mkdir -p $BACKUP_DIR
cp -r ../wallet-storage/* $BACKUP_DIR

echo "💰 Wallets backed up to $BACKUP_DIR"