const RuleInterface = require("./ruleInterface");
const {sleep } = require("../helpers/common")
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
    async perform(){

    };
}

module.exports = BalanceRule;