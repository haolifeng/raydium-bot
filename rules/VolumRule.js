const RuleInterface = require("./ruleInterface");
class BalanceRule extends RuleInterface {
    constructor(owner,client, market, config) {
        super();
        this.owner = owner;
        this.client = client;
        this.market = market;
        this.config = config;

    }
    run() {
    };

    checkCondition() {
    } ;

    perform() {
    };
}
module.exports = BalanceRule;