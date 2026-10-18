const RuleInterface = require("./ruleInterface");
const { sleep } = require("../helpers/common");
class VolumRule extends RuleInterface {
    constructor(owner,client, market, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.market = market;
        this.config = config;
        this.logger = global.appLogger;
    }
    async run() {
        while(true) {
            try{
                if(await this.checkCondition()) {
                    await this.perform();
                }
            }catch(e){
                this.logger.error('VolumRule run, e: ', e);
            }

            await sleep(this.config.checkInterval)
        }
    };

    checkCondition() {
        return true;
    } ;

    async  perform() {
        try{
            let inputMint = this.config.market.priceTrade.inputMint;
            let inputAmount = this.config.market.priceTrade.inputAmount;
            let txId = await this.market.swap(inputMint, inputAmount);
            if(!txId){
                this.logger.error("swap failed, no txId. inputMint: ", inputMint, "inputAmount: ", inputAmount);
                return;
            }
            this.logger.info("perform, swap , txid: ", txId);
        }catch (e) {
            this.logger.error('e:', e);
        }
    };
}
module.exports = VolumRule;
