// TODO: Implement ETH balance checking

const { ethers, utils } = require("ethers");

async function getEthBalance() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

    const signer = provider.getSigner()
    
    const latestBlock = await provider.getBlockNumber()
    const listOfAccounts = await provider.listAccounts(signer)
    
    console.log(latestBlock, listOfAccounts)
    
    const balance = await provider.getBalance("0xbaf6dc2e647aeb6f510f9e318856a1bcd66c5e19") // Randomly chosen ETH mainnet address w/ a balance
    
    console.log(utils.formatUnits(balance))
}

getEthBalance();