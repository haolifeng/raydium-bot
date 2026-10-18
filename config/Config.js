const {WSOLMint, USDCMint} = require("@raydium-io/raydium-sdk-v2");
const {PublicKey} = require("@solana/web3.js");

const readEnv = (name, fallback) => {
    const value = process.env[name];
    if (value === undefined || value.trim() === "") {
        if (fallback !== undefined) return fallback;
        throw new Error(`Missing required env var ${name}. Refusing to start.`);
    }
    return value.trim();
};

const asPublicKey = (name, value) => {
    try {
        return new PublicKey(value).toBase58();
    } catch (e) {
        throw new Error(`Invalid ${name}: ${value}`);
    }
};

const nodeUrl = (() => {
    const url = readEnv("NODE_URL");
    if (!/^https?:\/\//i.test(url)) {
        throw new Error(`Invalid NODE_URL: ${url}`);
    }
    if (/api\.(mainnet-beta|devnet|testnet)\.solana\.com/i.test(url)) {
        process.emitWarning(`NODE_URL points to a public Solana RPC (${url}); transactions may be front-run. Use a private/paid RPC for trading.`);
    }
    return url;
})();

const cluster = (() => {
    const explicit = process.env.CLUSTER && process.env.CLUSTER.trim();
    const inferred = /devnet/i.test(nodeUrl) ? "devnet" : "mainnet";
    if (!explicit) return inferred;
    if (explicit !== inferred) {
        throw new Error(`CLUSTER (${explicit}) does not match NODE_URL (${nodeUrl}). Refusing to start.`);
    }
    return explicit;
})();

const foundation = asPublicKey("FOUNDATION_ADDRESS", readEnv("FOUNDATION_ADDRESS"));
const poolId = asPublicKey("POOL_ID", readEnv("POOL_ID", "3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv"));

let config = {
    nodeUrl: nodeUrl,
    cluster: cluster,

    checkInterval:50* 1000,
    pool:{
        poolId:poolId,
        mintA:{
            scAddr:WSOLMint,
            softMaxLimit:10000 * 1000000,

        },
        mintB:{
            scAddr:USDCMint,
            softMaxLimit:10000 * 1000000
        },
        foundation:foundation,
        miniLowPrice:100

    },
    market:{
        gasMiniLimit:10000,
        unitPrice:465915,
        units:600000,

        priceTrade: {
            inputMint: USDCMint,
            inputAmount:100,
        }

    }

}

module.exports = config;
