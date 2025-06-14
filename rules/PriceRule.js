const RuleInterface = require("./ruleInterface");
const {USDCMint} = require("@raydium-io/raydium-sdk-v2");
class PriceRule  extends  RuleInterface{
    constructor(owner,client, market, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.market = market;
        this.config = config;
        this.logger = global.appLogger;

    }
    async run(){
        await this.checkCondition();
    };
    async checkCondition(){
        try{
            let poolinfo = await this.market.getPoolInfo();
            console.log("poolinfo", poolinfo);

            let poolPrice = poolinfo.price;
            let poolMintAmountA = poolinfo.mintAmountA;
            let poolMintAmountB = poolinfo.mintAmountB;
            let poolMintA = poolinfo.mintA;
            let poolMintB = poolinfo.mintB;

            if(poolinfo.price < this.config.pool.miniLowPrice){
                await this.perform();
            }


        }catch(e){
            this.logger.error('PriceRule: checkCondition', e);
        }

    } ;
    async perform(){
        let inputMint = this.config.market.priceTrade.inputMint;
        let inputAmount = this.config.market.priceTrade.inputAmount;
        let txId = await this.market.swap(inputMint, inputAmount);
        this.logger.info("perform, swap , txid: ", txId);
    };
}

module.exports = PriceRule;