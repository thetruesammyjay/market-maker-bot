# API Reference

## Blockchain API

### `GET /api/prices/:pair`
- Returns current market price data
- Example: `/api/prices/SOL-USDC`

```json
{
  "price": 150.25,
  "liquidity": 2500000,
  "volume24h": 500000
}
```

## Bot Commands API
**Telegram Endpoints**
- **`/connect_wallet`** - Authenticate wallet

- **`/buy <token> <amount>`** - Execute buy order

- **`/portfolio`** - View current holdings

## Webhook API
**`POST /webhooks/trades`**

- Trade execution notifications
```json
{
  "type": "buy",
  "token": "SOL",
  "amount": 1.5,
  "price": 150.25
}
```
