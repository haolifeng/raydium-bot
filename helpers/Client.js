const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const CONN_TIME_OUT = 10 * 30* 1000 * 2;
const  { TimeoutPromise } = require('../helpers/common')
class Client {
    constructor(url) {
        this.url = url;
        this.connection = new Connection(this.url);
        this.logger = global.appLogger;
    }
    getConnection() {
        return this.connection
    }
    async getBalance(pubKey) {
        try {
            const reqPromise =this.connection.getBalance(pubKey);
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getBalance, e: ",e );
            throw e;
        }
    }
    async getBlockHeight() {
        try{
            const reqPromise =   this.connection.getSlot({commitment:"finalized"});
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getBlockHeight, e: ",e );
            throw e;
        }

    }
    async getBlock(slot) {
        try{
            const reqPromise =    this.connection.getBlock(slot, {commitment: "finalized", maxSupportedTransactionVersion: 0, rewards:false});
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getBlock, e: ",e );
            throw e;
        }


    }
    async getBlocks(startSlot, endSlot) {
        try{
            const reqPromise =      this.connection.getBlocks(startSlot, endSlot, {commitment: "finalized", maxSupportedTransactionVersion: 0, rewards:false});
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getBlock, e: ",e );
            throw e;
        }


    }

    async getTransaction(signature,commitment='finalized') {
        try {
            const reqPromise  = this.connection.getTransaction(signature, {commitment:commitment, maxSupportedTransactionVersion: 0});
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getTransaction, e: ",e );
            throw e;
        }

    }
    async getAddressLookupTable(lookUptablePk) {
        try {
            const reqPromise  = this.connection.getAddressLookupTable(lookUptablePk);
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getAddressLookupTable, e: ",e );
            throw e;
        }
    }

    async getSignatureStatus(signaure) {
        try {
            const reqPromise  = this.connection.getSignatureStatus(signature);
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("getSignatureStatus, e: ",e );
            throw e;
        }
    }
    async sendTransaction(transaction, keypair) {
        try {

            const reqPromise  =  this.connection.sendTransaction( transaction, keypair);
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error("sendTransaction, e: ",e );
            throw e;
        }

    }
    async sendRawTransaction(rawTx) {
        try {

            const reqPromise = this.connection.sendRawTransaction(rawTx);
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error('sendRawTransaction, e: ',e);
            throw  e;
        }

    }
    async getLatestBlockhash() {
        try{
            let reqPromise = this.connection.getLatestBlockhash();
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }
        catch (e) {
            this.logger.error('getLatestBlockhash, e: ',e);
            throw  e;
        }
    }
    async getAccountInfo(publicKey) {
        try{
            let reqPromise = this.connection.getAccountInfo(publicKey, {commitment:"finalized"});
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;

            return ret;
        }catch (e) {
            this.logger.error('getAccountInfo, e:',e);
            throw e;
        }
    }
    async getSignaturesForAddress(programPubKey,until,before,limit){

        try{
            let reqPromise = this.connection.getSignaturesForAddress(programPubKey,{ until:until,before:before, limit:limit},"finalized");
            const reqPromiseWithTimeout = new TimeoutPromise(reqPromise, CONN_TIME_OUT);
            let ret = await reqPromiseWithTimeout;
            return ret;
        }catch (e) {
            this.logger.error('getSignaturesForAddress, e:',e);
            throw e;
        }
    }
    async getMintInfo(mintAddress) {
        try {
            const mintPublicKey = new PublicKey(mintAddress);

            const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
            if (mintInfo.value && mintInfo.value.data && mintInfo.value.data.parsed) {
                return mintInfo.value.data.parsed.info;
            }
            this.logger.warn('Could not retrieve the token decimals.', mintAddress);
            return null;
        } catch (err) {
            this.logger.error('Error fetching token info:', mintAddress, err);
            return null;
        }
    }
    async getTokenBalance(walletAddress, tokenMintAddress) {
        let log = this.logger;
        let client = this.connection;


        return new TimeoutPromise(async function (resolve, reject) {
            try {
                const tokenAccounts = await client.getParsedTokenAccountsByOwner(
                    new PublicKey(walletAddress),
                    {
                        programId: TOKEN_PROGRAM_ID,
                    }
                );
                log.debug('tokenAccounts', tokenAccounts);

                const tokenAccount = tokenAccounts.value.find(
                    accountInfo => accountInfo.account.data.parsed.info.mint === tokenMintAddress
                );
                log.debug('tokenMintAddress', tokenMintAddress, 'tokenAccount', tokenAccount, tokenAccount.pubkey);

                if (tokenAccount) {
                    const balance = await client.getTokenAccountBalance(tokenAccount.pubkey);
                    log.debug(`Token ${tokenMintAddress} tokenAccount ${tokenAccount.pubkey} Balance: ${balance.value.uiAmount}`);
                    resolve(balance.value.uiAmount);
                } else {
                    log.warn(`Token account not found, walletAddress ${walletAddress} tokenMintAddress ${tokenMintAddress}`);
                    resolve(0);
                }
            } catch (err) {
                reject(err);
            }
        }, CONN_TIME_OUT, "solana  getTokenBalance timeout");

    }
    getPublicKey(account) {
        return new PublicKey(account);
    }
    async getTokenAccount(walletAddress, tokenMintAddress) {
        let self = this;
        let log = this.log;
        return new TimeoutPromise(async function (resolve, reject) {
            try {
                let tokenAccountInfo = await self.connection.getAccountInfo(self.getPublicKey(tokenMintAddress));
                log.debug('getTokenAccount walletAddress %s, tokenMintAddress %s, tokenOwner %s', walletAddress, tokenMintAddress, tokenAccountInfo.owner.toString());
                const ataAddress = await getAssociatedTokenAddress(
                    self.getPublicKey(tokenMintAddress),
                    self.getPublicKey(walletAddress),
                    true,
                    self.getPublicKey(tokenAccountInfo.owner)
                );
                log.debug(`Associated Token Account Address: ${ataAddress.toString()}`);
                resolve(ataAddress.toString());
            } catch (err) {
                reject(err);
            }
        }, CONN_TIME_OUT, ' getTokenAccount timeout');
    }
}
module.exports = Client;