import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { RouteInfo } from '@jup-ag/core';

export type TransactionLike = Transaction | VersionedTransaction;

export interface TradeRecord {
    timestamp: Date;
    type: 'buy' | 'sell' | 'swap';
    token: string;
    amount: number;
    price: number;
    txId?: string;
    profitLoss?: number;
    metadata?: any;
}

export interface PortfolioBalance {
    mint: string;
    amount: number;
    decimals: number;
    value?: number;
}

export interface MarketData {
    price: number;
    liquidity: number;
    volume24h: number;
    priceChange24h: number;
    priceChange7d?: number;
}

export interface TokenMetadata {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    verified: boolean;
    tags?: string[];
}

export interface AlertPreference {
    channel: 'telegram' | 'discord' | 'email';
    token: string;
    threshold: number;
    direction: 'above' | 'below';
    active: boolean;
}

export interface RateLimitConfig {
    maxRequests: number;
    intervalMs: number;
    equalDistribution?: boolean;
}

export interface ApiResponse<T> {
    data: T;
    timestamp: number;
    fromCache: boolean;
}

export interface WalletConfig {
    publicKey: string;
    encryptedSecret: string;
    createdAt: string;
    lastUsed?: string;
    name?: string;
}

export interface RouteWithQuote extends RouteInfo {
    quote: {
        inAmount: number;
        outAmount: number;
        priceImpact: number;
    };
}

export interface PerformanceMetrics {
    netProfit: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    kellyCriterion: number;
}