const ethers = require('ethers');

export default async function createAccount(req, res) {
console.log("Create Account request body: ", req.body)

let wallet = ethers.Wallet.fromMnemonic(process.env.ETH_MNEMONIC); 
console.log("Ethereum wallet mnemonic: ", wallet.mnemonic.phrase)
console.log("Wallet address: ", wallet.address)
console.log("Public key: ", wallet.publicKey)
console.log("Private key: ", wallet.privateKey)
    return res
    .status(200)
    .json({ publicKey: wallet.publicKey, privateKey: wallet.privateKey, accountAddress: wallet.address });
}
