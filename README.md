# raydium-bot

A Node.js trading bot for [Raydium](https://raydium.io) **CLMM** pools on Solana. It reacts to price conditions, keeps the trading wallet funded for gas, sweeps excess balances to a foundation address, and can generate trading volume. Built on [`@raydium-io/raydium-sdk-v2`](https://www.npmjs.com/package/@raydium-io/raydium-sdk-v2).

English | [中文](./README.zh-CN.md)

## Features

- **CLMM swaps** via the Raydium SDK v2 (concentrated liquidity pools).
- **Rule-based strategy engine** — pluggable rules under `rules/`.
  - `PriceRule`: triggers a swap when the pool price drops below a configured threshold.
  - `BalanceRule`: monitors the SOL gas balance and sweeps surplus SOL/token balance to the foundation address.
  - `VolumRule`: periodically swaps to generate trading volume.
- **Automatic priority fee** configuration for swap transactions.
- **Rotating file logger** (winston + winston-daily-rotate-file).
- **Safety guards** on startup: validates the RPC URL, the cluster, the mnemonic/secret key, and required env vars, refusing to start on bad input.

## Requirements

- Node.js 18+
- A Solana RPC endpoint (a private/paid RPC is strongly recommended for trading)
- A funded Solana wallet

## Installation

```bash
git clone https://github.com/haolifeng/raydium-bot.git
cd raydium-bot
npm install
```

## Configuration

Configuration is read from environment variables (loaded via `dotenv`). Create a `.env` file in the project root:

```dotenv
# Required
NODE_URL=https://your-private-rpc-endpoint
FOUNDATION_ADDRESS=<foundation wallet public key>
POOL_ID=<raydium clmm pool id>

# Wallet — provide ONE of the following
words="word1 word2 ... word12"          # BIP39 mnemonic (derivation path m/44'/501'/0'/0')
# pk=<hex encoded secret key>           # alternative to mnemonic

# Optional
CLUSTER=mainnet                         # must match NODE_URL (inferred if omitted)
LOG_LEVEL=info                          # debug | info | warning | error
```

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_URL` | Yes | Solana RPC URL (`http`/`https`). Public RPCs emit a front-running warning. |
| `FOUNDATION_ADDRESS` | Yes | Public key that receives swept balances. |
| `POOL_ID` | Yes | Raydium CLMM pool id (has a default, but you should set your own). |
| `words` | One of | BIP39 mnemonic used to derive the trading keypair. |
| `pk` | One of | Hex-encoded secret key used as the trading keypair. |
| `CLUSTER` | No | `mainnet` or `devnet`; must match `NODE_URL`. |
| `LOG_LEVEL` | No | Log level, defaults to `info`. |

### Strategy parameters

Static parameters (check interval, soft limits, slippage, compute budget, price threshold) live in [`config/Config.js`](config/Config.js). Notable values:

- `checkInterval` — loop interval in milliseconds (default 50s).
- `pool.miniLowPrice` — the `PriceRule` swap trigger threshold.
- `pool.mintA` / `pool.mintB.softMaxLimit` — balances above these are swept to the foundation.
- `market.gasMiniLimit` — minimum SOL balance before a low-gas warning.
- `market.unitPrice` / `market.units` — priority fee (microLamports) and compute unit limit.

## Usage

```bash
node bots/Bot.js
```

The entry point is [`bots/Bot.js`](bots/Bot.js): it loads the market, resolves the wallet, and runs the configured rule(s). Adjust which rule runs in `main()` — `PriceRule` is enabled by default, `BalanceRule` and `VolumRule` are available.

## Project structure

```
bots/Bot.js            # entry point: wires client, wallet, market and rules
config/Config.js       # env + strategy configuration
helpers/Client.js      # Solana connection wrapper (balances, transfers, tokens)
helpers/Market.js      # Raydium CLMM market + swap logic
helpers/common.js      # sleep + timeout promise utilities
helpers/logger.js      # winston rotating logger
rules/                 # strategy rules (PriceRule, BalanceRule, VolumRule)
rules/ruleInterface.js # base rule interface (run / checkCondition / perform)
wallets/Wallet.js      # keypair from mnemonic or hex secret key
```

## Extending

Create a rule by extending `RuleInterface` (`rules/ruleInterface.js`) and implementing `run()` / `checkCondition()` / `perform()`, then wire it into `main()` in `bots/Bot.js`.

```js
const RuleInterface = require("./ruleInterface");

class MyRule extends RuleInterface {
  constructor(owner, client, market, config) {
    super();
    this.owner = owner;
    this.client = client;
    this.market = market;
    this.config = config;
    this.logger = global.appLogger;
  }
  async run() { /* loop */ }
  async checkCondition() { /* return bool */ }
  async perform() { /* act */ }
}

module.exports = MyRule;
```

## Disclaimer

This software is provided for educational purposes. Automated trading on Solana is risky — you may lose funds. Never commit your `.env`, mnemonic, or secret key. Use at your own risk. See [`LICENSE`](LICENSE).
