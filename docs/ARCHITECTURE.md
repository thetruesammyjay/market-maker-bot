# System Architecture

## Core Components

```mermaid
graph TD
    A[Telegram Bot] --> B[Market Engine]
    B --> C[Blockchain Adapters]
    C --> D[Solana Network]
    B --> E[Risk Manager]
    B --> F[Analytics]
```

## Data Flow
1. **Price Updates**:
    - DEX APIs → Market Data Service → Strategy Engine

2. **Trade Execution**:
    - User Command → Order Manager → JITO Bundler → Solana

3. **Monitoring**:
    - Chain Data → Alert Service → Telegram/Discord