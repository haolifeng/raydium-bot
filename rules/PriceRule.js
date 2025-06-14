const RuleInterface = require("./ruleInterface");
class PriceRule  extends  RuleInterface{
    constructor(owner,client, market, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.market = market;
        this.config = config;
        this.logger = global.appLogger;

    }
    run(){};
    checkCondition(){
        try{


        }catch(e){
            this.logger.error('PriceRule: checkCondition', e);
        }

    } ;
    perform(){};
}

module.exports = PriceRule;