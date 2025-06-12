const { Connection } = require('@solana/web3.js');
class Client {
    constructor(url) {
        this.url = url;
        this.connection = new Connection(this.url);
    }
    getConnection() {
        return this.connection
    }
}
module.exports = Client;