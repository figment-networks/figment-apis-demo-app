// TODO: Implement staked ETH balance checking

const { ethers, utils } = require("ethers");

export default async function (req, res) {
    console.log(req.body)
    try {
        if (!req.query.accountAddress) return res.status(406).send("missing account address");

        const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

        const signer = provider.getSigner(process.env.ETH_ADDRESS)
        
        const latestBlock = await provider.getBlockNumber()
        const listOfAccounts = await provider.listAccounts(signer)
        
        console.log(listOfAccounts)
        
        const balance = await provider.getBalance(process.env.ETH_ADDRESS) // ETH testnet address w/ a 32 ETH balance
        const staked = 0.0;
        console.log(utils.formatUnits(balance))
    
        return res
        .status(200)
        .json({ available: utils.formatUnits(balance), staked, latestBlock });

    } catch(error) {
      console.log(error)
      return res.status(500).send(error.message)
    }
  }
  
