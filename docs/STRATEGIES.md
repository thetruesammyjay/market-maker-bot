# Trading Strategies

## Market Making

```python
def calculate_spread(mid_price):
    bid = mid_price * (1 - spread_pct)
    ask = mid_price * (1 + spread_pct)
    return (bid, ask)
```
## Arbitrage
DEX Pair	Price Difference	Profit Potential
SOL-USDC	0.5%	            250 per 50k

## Parameters
- `spread_pct`: 0.5-2%

- `min_profitability`: 0.3%

- `max_slippage`: 1%