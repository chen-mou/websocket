const { generateKeyPairSync, publicDecrypt, privateDecrypt } = require('crypto');
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret'
    }
})

function decode(text){
    return privateDecrypt(privateKey, text).toString()
}

function encode(text){

}


module.exports = {
    publicKey: publicKey,
    privateKey: privateKey,
    decode: decode,
    encode: encode
}