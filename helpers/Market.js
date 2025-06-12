const { API_URLS,Raydium, TxVersion, parseTokenAccountResp } = require('@raydium-io/raydium-sdk-v2');
class Market {
    constructor(connection, owner,params) {
        this.owner = owner;
        this.connection = connection;
        this.params = params;
        this.radium = null;
    }
    async loadRaydium(){
        this.radium = await Raydium.load({
            owner:this.owner,
            connection:this.connection,
            cluster:"mainnet",
            disableFeatureCheck: true,
            disableLoadToken: !this.params?.loadToken,
            blockhashCommitment: 'finalized',
            // urlConfigs: {
            //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
            // },
        });
    }

}

module.exports = Market;