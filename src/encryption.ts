import * as openpgp from 'openpgp'

export async function decrypt ({ message, passphrase, keyPair }) {
  const privKeyObj = (await openpgp.key.readArmored(keyPair.privateKey)).keys[0]
  await privKeyObj.decrypt(passphrase)

  const options = {
    message: await openpgp.message.readArmored(message),
    // publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification (optional)
    privateKeys: [privKeyObj]
  }

  const plaintext = await openpgp.decrypt(options)
  return plaintext
}


export async function encrypt ({ message, passphrase, keyPair }) {
  const privKeyObj = (await openpgp.key.readArmored(keyPair.privateKey)).keys[0]
  await privKeyObj.decrypt(passphrase)

  const options = {
    message: openpgp.message.fromText(message),
    armored: false,
    publicKeys: (await openpgp.key.readArmored(keyPair.publicKey)).keys, // for verification (optional)
    privateKeys: [privKeyObj]
  }

  const cyphertext = await openpgp.encrypt(options)
  return cyphertext
}


export async function generateKeyPair(options) {
  const { key, ...rest } = await openpgp.generateKey(options)
  return rest
}