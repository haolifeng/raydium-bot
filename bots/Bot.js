require('dotenv').config();
const config = require('../config/Config.js');

global.loglevel = 'debug';

const Logger = require('../helpers/logger.js');
global.appLogger = new Logger("raydium-bot", "log/raydium-bot.log", "log/raydium-bot.log", global.loglevel);

const main = async () => {


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