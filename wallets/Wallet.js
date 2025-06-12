const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { Keypair } = require('@solana/web3.js');

const myKeyPairByMne = ()=> {
    let words = process.env.words;
    const seed = bip39.mnemonicToSeedSync(words, "");
    const seedWords = derivePath(`m/44'/501'/0'/0'`, seed.toString('hex')).key;
    //const seedWordStr = seedWords.toString('hex');
    const owner = Keypair.fromSeed(seedWords);

    return owner;
}

const myKeyPairByScretKey = ()=> {
    let pk = process.env.pk;

    const owner = Keypair.fromSecretKey(new Buffer.from(pk, 'hex'));
    return owner;
}

module.exports = {
    myKeyPairByMne, myKeyPairByScretKey
}
