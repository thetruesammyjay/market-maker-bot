interface RateLimiterConfig {
    maxRequests: number;
    intervalMs: number;
    equalDistribution?: boolean;
}

export class RateLimiter {
    private queue: number[] = [];
    private lastIntervalStart: number = Date.now();
    private tokens: number;

    constructor(
        private config: RateLimiterConfig
    ) {
        this.tokens = config.maxRequests;
    }

    async wait(): Promise<void> {
        if (this.config.equalDistribution) {
            return this.equalDistributionWait();
        }
        return this.tokenBucketWait();
    }

    private async tokenBucketWait(): Promise<void> {
        const now = Date.now();
        this.refillTokens(now);

        if (this.tokens > 0) {
            this.tokens--;
            return;
        }

        const timeToWait = this.config.intervalMs - (now - this.lastIntervalStart);
        await new Promise(resolve => setTimeout(resolve, timeToWait));
        return this.wait();
    }

    private async equalDistributionWait(): Promise<void> {
        const now = Date.now();
        const timePerRequest = this.config.intervalMs / this.config.maxRequests;

        if (this.queue.length < this.config.maxRequests) {
            this.queue.push(now);
            return;
        }

        const earliestTime = this.queue[0];
        const timeSinceEarliest = now - earliestTime;

        if (timeSinceEarliest < this.config.intervalMs) {
            const timeToWait = this.config.intervalMs - timeSinceEarliest;
            await new Promise(resolve => setTimeout(resolve, timeToWait));
            return this.equalDistributionWait();
        }

        this.queue.shift();
        this.queue.push(now);
    }

    private refillTokens(now: number): void {
        const timePassed = now - this.lastIntervalStart;
        if (timePassed >= this.config.intervalMs) {
            this.tokens = this.config.maxRequests;
            this.lastIntervalStart = now;
        }
    }
}

export class GlobalRateLimiter {
    private static limiters: Record<string, RateLimiter> = {};

    static getLimiter(key: string, config: RateLimiterConfig): RateLimiter {
        if (!this.limiters[key]) {
            this.limiters[key] = new RateLimiter(config);
        }
        return this.limiters[key];
    }

    static async wait(key: string, config: RateLimiterConfig): Promise<void> {
        const limiter = this.getLimiter(key, config);
        return limiter.wait();
    }
}