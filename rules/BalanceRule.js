const RuleInterface = require("./ruleInterface");
const {sleep } = require("../helpers/common")
const {WSOLMint} = require("@raydium-io/raydium-sdk-v2");
const {PublicKey} = require("@solana/web3.js");
class BalanceRule extends RuleInterface{
    constructor(owner, client, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.config = config;
        this.logger = global.appLogger;
        this.foundation = new PublicKey(this.config.pool.foundation);
    }
    async run(){
        while(true){
            try {
                await this.checkCondition();
            }catch(err){
                this.logger.error("error", err);
            }

            await sleep(this.config.checkInterval);
        }
    };
    async checkCondition(){

        await this.checkGasSolBalance();
        await this.checkMintBalance();


    } ;
    async checkGasSolBalance(){

        let gasMiniLimit = this.config.market.gasMiniLimit;

        let ownerAddr = this.owner.publicKey
        let solBalance =await  this.client.getBalance(ownerAddr);

        if(solBalance < gasMiniLimit){
            this.logger.error("sol balance is too low, need to add balance, ", "ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }else{
            this.logger.info("sol balance is normal, don't worry, ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }

    }
    async sweepSol(balance, softMaxLimit, mint){
        let leftAmount = balance - softMaxLimit;
        if(leftAmount <= 0){
            return;
        }
        try{
            let ret = await this.client.sendSolAndConfirmTransaction(this.owner, this.foundation, leftAmount);
            this.logger.info('mint ', mint, ' balance too high, send foundation leftBalance: ', leftAmount, ', ret: ', ret);
        }catch(e){
            this.logger.error('sweepSol failed, mint: ', mint, 'leftAmount: ', leftAmount, 'e: ', e);
        }
    }
    async sweepToken(balance, softMaxLimit, mint){
        let leftAmount = balance - softMaxLimit;
        if(leftAmount <= 0){
            return;
        }
        try{
            let ret = await this.client.sendTokenAndConfirmTransaction(mint, this.owner, this.foundation, leftAmount);
            this.logger.info('mint ', mint, ' balance too high, send foundation leftBalance: ', leftAmount, ', ret: ', ret);
        }catch(e){
            this.logger.error('sweepToken failed, mint: ', mint, 'leftAmount: ', leftAmount, 'e: ', e);
        }
    }
    async checkMintBalance(){
        let mintA = this.config.pool.mintA.scAddr;
        let mintB = this.config.pool.mintB.scAddr;

        if(mintA === WSOLMint){
            let mintABalance = await this.client.getBalance(this.owner.publicKey);
            await this.sweepSol(mintABalance, this.config.pool.mintA.softMaxLimit, mintA);
        }else{
            let mintABalance = await this.client.getTokenBalance(this.owner.publicKey, mintA);
            this.logger.debug('checkMintBalance, mintA', mintA, 'get TokenBalance: ', mintABalance);
            await this.sweepToken(mintABalance, this.config.pool.mintA.softMaxLimit, mintA);
        }

        if(mintB === WSOLMint){
            let mintBBalance = await this.client.getBalance(this.owner.publicKey);
            await this.sweepSol(mintBBalance, this.config.pool.mintB.softMaxLimit, mintB);
        }else{
            let mintBBalance = await this.client.getTokenBalance(this.owner.publicKey, mintB);
            this.logger.debug('checkMintBalance, mintB', mintB, 'get TokenBalance: ', mintBBalance);
            await this.sweepToken(mintBBalance, this.config.pool.mintB.softMaxLimit, mintB);
        }

    }
    async perform(){

    };
}

module.exports = BalanceRule;
