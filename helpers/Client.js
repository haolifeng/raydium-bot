const { Connection } = require('@solana/web3.js');
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
}
module.exports = Client;