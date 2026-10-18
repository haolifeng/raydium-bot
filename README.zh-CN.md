# raydium-bot

一个基于 Node.js 的 Solana 链上 [Raydium](https://raydium.io) **CLMM**（集中流动性）池交易机器人。它可以根据价格条件触发交易、为交易钱包保持足够的 gas 费用、把超额余额归集到基金会地址，并可用于刷交易量。底层使用 [`@raydium-io/raydium-sdk-v2`](https://www.npmjs.com/package/@raydium-io/raydium-sdk-v2)。

[English](./README.md) | 中文

## 功能特性

- **CLMM 兑换**：通过 Raydium SDK v2 在集中流动性池中交易。
- **基于规则的策略引擎**：`rules/` 下的可插拔规则。
  - `PriceRule`：当池子价格低于配置阈值时触发兑换。
  - `BalanceRule`：监控 SOL gas 余额，并将超额的 SOL/代币余额归集到基金会地址。
  - `VolumRule`：定时兑换以产生交易量。
- **自动优先费用**：为兑换交易配置 compute budget / 优先费。
- **滚动日志**：基于 winston + winston-daily-rotate-file。
- **启动安全校验**：校验 RPC URL、集群、助记词/私钥以及必需的环境变量，输入非法时拒绝启动。

## 环境要求

- Node.js 18+
- Solana RPC 节点（交易场景强烈建议使用私有/付费 RPC）
- 有余额的 Solana 钱包

## 安装

```bash
git clone https://github.com/haolifeng/raydium-bot.git
cd raydium-bot
npm install
```

## 配置

配置通过环境变量读取（使用 `dotenv` 加载）。在项目根目录创建 `.env` 文件：

```dotenv
# 必填
NODE_URL=https://your-private-rpc-endpoint
FOUNDATION_ADDRESS=<基金会钱包公钥>
POOL_ID=<raydium clmm 池 id>

# 钱包 —— 以下二选一
words="word1 word2 ... word12"          # BIP39 助记词（派生路径 m/44'/501'/0'/0'）
# pk=<十六进制编码的私钥>              # 与助记词二选一

# 可选
CLUSTER=mainnet                         # 必须与 NODE_URL 匹配（省略时自动推断）
LOG_LEVEL=info                          # debug | info | warning | error
```

### 环境变量说明

| 变量 | 是否必填 | 说明 |
| --- | --- | --- |
| `NODE_URL` | 是 | Solana RPC 地址（`http`/`https`）。使用公共 RPC 时会输出被抢跑的风险警告。 |
| `FOUNDATION_ADDRESS` | 是 | 接收归集资金的公钥。 |
| `POOL_ID` | 是 | Raydium CLMM 池 id（有默认值，但建议自行设置）。 |
| `words` | 二选一 | 用于派生交易密钥对的 BIP39 助记词。 |
| `pk` | 二选一 | 作为交易密钥对的十六进制私钥。 |
| `CLUSTER` | 否 | `mainnet` 或 `devnet`，必须与 `NODE_URL` 匹配。 |
| `LOG_LEVEL` | 否 | 日志级别，默认 `info`。 |

### 策略参数

静态参数（检查间隔、软上限、滑点、compute budget、价格阈值）位于 [`config/Config.js`](config/Config.js)。主要参数：

- `checkInterval` —— 循环间隔，毫秒（默认 50s）。
- `pool.miniLowPrice` —— `PriceRule` 的兑换触发阈值。
- `pool.mintA` / `pool.mintB.softMaxLimit` —— 余额超过该值将归集到基金会。
- `market.gasMiniLimit` —— 触发低 gas 警告的最低 SOL 余额。
- `market.unitPrice` / `market.units` —— 优先费（microLamports）与 compute unit 上限。

## 运行

```bash
node bots/Bot.js
```

入口文件是 [`bots/Bot.js`](bots/Bot.js)：加载市场、解析钱包，并运行配置的规则。可在 `main()` 中调整要运行的规则——默认启用 `PriceRule`，同时提供 `BalanceRule` 和 `VolumRule`。

## 项目结构

```
bots/Bot.js            # 入口：串联客户端、钱包、市场和规则
config/Config.js       # 环境变量 + 策略配置
helpers/Client.js      # Solana 连接封装（余额、转账、代币）
helpers/Market.js      # Raydium CLMM 市场 + 兑换逻辑
helpers/common.js      # sleep + 超时 Promise 工具
helpers/logger.js      # winston 滚动日志
rules/                 # 策略规则（PriceRule、BalanceRule、VolumRule）
rules/ruleInterface.js # 规则基类接口（run / checkCondition / perform）
wallets/Wallet.js      # 从助记词或十六进制私钥生成密钥对
```

## 扩展

继承 `RuleInterface`（`rules/ruleInterface.js`）并实现 `run()` / `checkCondition()` / `perform()`，然后在 `bots/Bot.js` 的 `main()` 中接入即可。

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
  async run() { /* 循环 */ }
  async checkCondition() { /* 返回布尔值 */ }
  async perform() { /* 执行动作 */ }
}

module.exports = MyRule;
```

## 免责声明

本项目仅供学习交流使用。Solana 上的自动化交易存在风险，可能造成资金损失。切勿提交 `.env`、助记词或私钥。使用风险自负，详见 [`LICENSE`](LICENSE)。
