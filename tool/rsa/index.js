const {generateKeyPairSync, publicEncrypt, privateDecrypt} = require('crypto');
// const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//         cipher: 'aes-256-cbc',
//         passphrase: 'top secret'
//     }
// }),
const nodeRsa = require('node-rsa'),
    key = new nodeRsa({b: 512});

key.setOptions({encryptionScheme: 'pkcs1'})

const pk = key.exportKey('pkcs8-public-pem'),
    prk = key.exportKey('pkcs8-private-pem')

function decode(text) {
    let buff = Buffer.from(text, 'base64')
    return key.importKey(prk).decrypt(buff, 'utf8')
}

function encode(text) {
    return publicEncrypt(pk, Buffer.from(text)).toString('base64')
}


module.exports = {
    publicKey: pk,
    privateKey: prk,
    decode: decode,
    encode: encode
}

console.log(pk)