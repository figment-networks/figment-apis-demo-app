function useNearSdk() {
    const config = {
        nodeUrl: "https://rpc.testnet.near.org",
        deps: {
            keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        },
        networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
    }
}