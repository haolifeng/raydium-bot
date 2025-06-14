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
    async checkMintBalance(){
        let mintA = this.config.pool.mintA.scAddr;
        let mintB = this.config.pool.mintB.scAddr;
        let mintABalance = 0;
        if(mintA === WSOLMint){
             mintABalance =await  this.client.getBalance(this.owner.publicKey);
            if(mintABalance > this.config.pool.mintA.softMaxLimit){
                let leftAmount = mintABalance - this.config.pool.mintA.softMaxLimit;
                let toPubkey = new PublicKey(this.config.pool.foundation);
            //    let ret = await this.client.sendSolAndConfirmTransaction(this.owner, toPubkey, leftAmount);
                this.logger.info('mintA', mintA, ' balance too high, send found leftbalance: ', leftAmount, ', ret: ', ret);
            }
        }else{
             mintABalance = await this.client.getTokenBalance(this.owner.publicKey, mintA);
             this.logger.debug('checkMintBalance, mintA', mintA, 'get TokenBalance: ', mintABalance);
            if(mintABalance > this.config.pool.mintA.softMaxLimit){
                let leftAmount = mintABalance - this.config.pool.mintA.softMaxLimit;
                let toPubkey = new PublicKey(this.config.pool.foundation);
         //       let ret = await this.client.sendTokenAndConfirmTransaction(mintA, this.owner, toPubkey, leftAmount);
                this.logger.info('mintA', mintA, ' balance too high, send found leftbalance: ', leftAmount, ', ret: ', ret);
            }
        }

        let mintBBalance = 0;
        if(mintB === WSOLMint){
             mintBBalance =await  this.client.getBalance(this.owner.publicKey);
            if(mintBBalance > this.config.pool.mintB.softMaxLimit) {
                let leftBmount = mintBBalance - this.config.pool.mintB.softMaxLimit;
                let toPubkey = new PublicKey(this.config.pool.foundation);
          //      let ret = await this.client.sendSolAndConfirmTransaction(this.owner, toPubkey, leftBmount);
                this.logger.info('mintB', mintB, ' balance too high, send found leftbalance: ', leftBmount, ', ret: ', ret);

            }
        }else{
             mintBBalance = await this.client.getTokenBalance(this.owner.publicKey, mintB);
            this.logger.debug('checkMintBalance, mintB', mintB, 'get TokenBalance: ', mintBBalance);
            if(mintBBalance > this.config.pool.mintB.softMaxLimit) {
                let leftBmount = mintBBalance - this.config.pool.mintB.softMaxLimit;
                let toPubkey = new PublicKey(this.config.pool.foundation);
          //      let ret = await this.client.sendTokenAndConfirmTransaction(mintB, this.owner, toPubkey, leftAmount);
                this.logger.info('mintB', mintB, ' balance too high, send found leftbalance: ', leftBmount, ', ret: ', ret);
            }
        }

    }
    async perform(){

    };
}

module.exports = BalanceRule;