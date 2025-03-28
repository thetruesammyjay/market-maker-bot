export class RateLimiter {
    private queue: number[] = [];
    
    constructor(
        private readonly maxRequests: number,
        private readonly perMilliseconds: number
    ) {}

    async check(): Promise<void> {
        const now = Date.now();
        this.queue = this.queue.filter(timestamp => 
            now - timestamp < this.perMilliseconds
        );

        if (this.queue.length >= this.maxRequests) {
            const oldest = this.queue[0];
            const waitTime = this.perMilliseconds - (now - oldest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.check();
        }

        this.queue.push(now);
    }
}