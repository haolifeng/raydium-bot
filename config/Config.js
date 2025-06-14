const {SOLMint,WSOLMint, USDCMint} = require("@raydium-io/raydium-sdk-v2");

let config = {
    nodeUrl:"https://api.devnet.solana.com",

    checkInterval:50* 1000,
    pool:{
        poolId:"3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv",
        mintA:{
            scAddr:WSOLMint,
            softMaxLimit:10000 * 1000000
        },
        mintB:{
            scAddr:USDCMint,
            softMaxLimit:10000 * 1000000
        },
    },
    market:{
        gasMiniLimit:10000,

    }

}

module.exports = config;