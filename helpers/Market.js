const { API_URLS,Raydium, TxVersion, parseTokenAccountResp,
    CLMM_PROGRAM_ID, DEVNET_PROGRAM_ID, ALL_PROGRAM_ID, SOLMint,WSOLMint,
    ApiV3PoolInfoConcentratedItem,
    ClmmKeys,
    ComputeClmmPoolInfo,
    PoolUtils,
    ReturnTypeFetchMultiplePoolTickArrays,
    RAYMint,

} = require('@raydium-io/raydium-sdk-v2');

const config = require('../config/Config')

const VALID_PROGRAM_ID = new Set([CLMM_PROGRAM_ID.toBase58(), DEVNET_PROGRAM_ID.CLMM.toBase58()])

const isValidClmm = (id) => VALID_PROGRAM_ID.has(id)


class Market {
    constructor(connection, owner,params) {
        this.owner = owner;
        this.connection = connection;
        this.params = params;
        this.radium = null;
        this.logger = global.appLogger;
        this.pool = null;
    }
    async loadRaydium(){
        this.radium = await Raydium.load({
            owner:this.owner,
            connection:this.connection,
            cluster:"mainnet",
            disableFeatureCheck: true,
            disableLoadToken: !this.params?.loadToken,
            blockhashCommitment: 'finalized',
            // urlConfigs: {
            //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
            // },
        });
    }

    async setPoolId(poolId){
        this.poolId = poolId;
    }

    async getPoolInfo(){
        try{
            const data = await this.radium.api.fetchPoolById({ids:this.poolId});
            let poolInfo = data[0];
            return poolInfo;
        }catch (e) {
            this.logger.error('e', e);
        }
    }

    async swap(inputMint,inputAmount ){
        try {
            const data = await this.radium.api.fetchPoolById({ids: this.poolId});
            let poolInfo = data[0];
            let poolKeys = undefined;
            if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')

            let clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
                connection: this.radium.connection,
                poolInfo,
            });

            let tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
                connection: this.radium.connection,
                poolKeys: [clmmPoolInfo],
            });
            if (inputMint !== poolInfo.mintA.address && inputMint !== poolInfo.mintB.address)
                throw new Error('input mint does not match pool')

            const baseIn = inputMint === poolInfo.mintA.address;

            let epochInfo = await this.radium.fetchEpochInfo()

            const {minAmountOut, remainingAccounts} = PoolUtils.computeAmountOutFormat({
                poolInfo: clmmPoolInfo,
                tickArrayCache: tickCache[this.poolId],
                amountIn: inputAmount,
                tokenOut: poolInfo[baseIn ? 'mintB' : 'mintA'],
                slippage: 0.01,
                epochInfo: epochInfo,
            })

            const {execute} = await this.radium.clmm.swap({
                poolInfo,
                poolKeys,
                inputMint: poolInfo[baseIn ? 'mintA' : 'mintB'].address,
                amountIn: inputAmount,
                amountOutMin: minAmountOut.amount.raw,
                observationId: clmmPoolInfo.observationId,
                ownerInfo: {
                    useSOLBalance: true, // if wish to use existed wsol token account, pass false
                },
                remainingAccounts,
                txVersion: TxVersion.V0,
                // optional: set up priority fee here
                computeBudgetConfig: {
                    units: config.market.units,
                    microLamports: config.market.unitPrice,
                },
                // txTipConfig: {
                //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
                //   amount: new BN(10), //
                // },


            });

            const {txId} = await execute();

            return txId;
        }catch (e) {
            this.logger.error('error', e);
        }
    }





}

module.exports = Market;