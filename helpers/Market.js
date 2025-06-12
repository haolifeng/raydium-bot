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
            owner,
            connection,
            cluster,
            disableFeatureCheck: true,
            disableLoadToken: !params?.loadToken,
            blockhashCommitment: 'finalized',
            // urlConfigs: {
            //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
            // },
        });
    }

}

module.exports = Market;