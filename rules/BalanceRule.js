const RuleInterface = require("./ruleInterface");
const {sleep } = require("../helpers/common")
const {WSOLMint} = require("@raydium-io/raydium-sdk-v2");
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

        let gasMiniLimit = this.config.market.gasMiniLimit;

        let ownerAddr = this.owner.publicKey
        let solBalance =await  this.client.getBalance(ownerAddr);

        if(solBalance < gasMiniLimit){
            this.logger.error("current, sol balance is too low, need to add balance, ", "ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }else{
            this.logger.info("current, sol balance is normal, don't worry, ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }


    } ;
    async checkGasSolBalance(){

        let gasMiniLimit = this.config.market.gasMiniLimit;

        let ownerAddr = this.owner.publicKey
        let solBalance =await  this.client.getBalance(ownerAddr);

        if(solBalance < gasMiniLimit){
            this.logger.error("current, sol balance is too low, need to add balance, ", "ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }else{
            this.logger.info("current, sol balance is normal, don't worry, ownerAddr: ", ownerAddr.toBase58(), "current solBalance: ", solBalance, "gasMiniLimit: ", gasMiniLimit);
        }

    }
    async checkMintBalance(){
        let mintA = this.config.pool.mintA.scAddr;
        let mintB = this.config.pool.mintB.scAddr;
        let mintABalance = 0;
        if(mintA === WSOLMint){
             mintABalance =await  this.client.getBalance(this.owner.publicKey);
        }else{
             mintABalance = await this.client.getTokenBalance(this.owner.publicKey, mintA);
        }
        if(mintABalance > this.config.pool.mintA.softMaxLimit){

        }
        let mintBBalance = 0;
        if(mintB === WSOLMint){
             mintBBalance =await  this.client.getBalance(this.owner.publicKey);
        }else{
             mintBBalance = await this.client.getTokenBalance(this.owner.publicKey, mintB);
        }
        if(mintBBalance > this.config.pool.mintB.softMaxLimit) {

        }
    }
    async perform(){

    };
}

module.exports = BalanceRule;