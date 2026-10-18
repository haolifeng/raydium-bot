const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { Keypair } = require('@solana/web3.js');

const myKeyPairByMne = ()=> {
    let words = process.env.words;
    if (!words || !bip39.validateMnemonic(words.trim())) {
        throw new Error("Invalid or missing mnemonic in env var 'words'. Refusing to start.");
    }
    const seed = bip39.mnemonicToSeedSync(words.trim(), "");
    const seedWords = derivePath(`m/44'/501'/0'/0'`, seed.toString('hex')).key;
    const owner = Keypair.fromSeed(seedWords);

    return owner;
}

const myKeyPairByScretKey = ()=> {
    let pk = process.env.pk;
    if (!pk || !/^[0-9a-fA-F]+$/.test(pk.trim()) || pk.trim().length % 2 !== 0) {
        throw new Error("Invalid or missing secret key in env var 'pk'. Refusing to start.");
    }

    const owner = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(pk.trim(), 'hex')));
    return owner;
}

module.exports = {
    myKeyPairByMne, myKeyPairByScretKey
}
