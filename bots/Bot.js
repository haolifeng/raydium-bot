require('dotenv').config();
const config = require('../config/Config.js');

global.loglevel = 'debug';

const Logger = require('../helpers/logger.js');
global.appLogger = new Logger("raydium-bot", "log/raydium-bot.log", "log/raydium-bot.log", global.loglevel);


const Client = require('../helpers/Client.js');
const Market = require('../helpers/Market.js');

const { sleep } = require('../helpers/common.js');
const {myKeyPairByMne } = require("../wallets/Wallet");

const BalanceRule = require("../rules/BalanceRule.js");

const main = async () => {
    let client = new Client(config.nodeUrl);
    let owner = myKeyPairByMne();
    let market = new Market(client.connection, owner,{loadToken:true});
    await market.loadRaydium();

    if(market.radium === null) {
        global.appLogger.error("No radium bot found.");
        process.exit(1);
    }

    let balanceRule = new BalanceRule(owner, client, config);




    await balanceRule.run();

}
// catch unhandled errors
process.on('unhandledRejection', error => {
    global.appLogger.error('Unhandled promise rejection:', error);
    // sleep 60s
    global.appLogger.info('restart after 1 minute.');
    setTimeout(() => process.exit(1), 60000);
});

// catch uncaught exceptions
process.on('uncaughtException', error => {
    global.appLogger.error('Uncaught exception:', error);
    // sleep 60s
    global.appLogger.info('restart after 1 minute.');
    setTimeout(() => process.exit(1), 60000);
});


if (require.main === module) {
    main().then(console.log).catch(console.log);
}