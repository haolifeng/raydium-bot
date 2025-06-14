const RuleInterface = require("./ruleInterface");
const config = require("../config/Config");
const { sleep } = require("../helpers/common");
class VolumRule extends RuleInterface {
    constructor(owner,client, market, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.market = market;
        this.config = config;

    }
    async run() {
        while(True) {
            if(this.checkCondition()) {
                await this.perform();
            }

            await sleep()
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
            this.logger.info("perform, swap , txid: ", txId);
        }catch (e) {
            this.logger.error('e:', e);
        }
    };
}
module.exports = VolumRule;