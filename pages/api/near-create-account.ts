import {keyStores, ConnectConfig, KeyPair, connect} from 'near-api-js';
import {InMemoryKeyStore} from 'near-api-js/lib/key_stores';

export const nearConfig = (): ConnectConfig => {
  const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
  const nodeUrl = 'https://rpc.testnet.near.org';
  const config = {
    keyStore,
    nodeUrl,
    networkId: 'testnet',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org'
  };
  return config;
};

export const transactionUrl = (hash: string) =>
  `https://explorer.testnet.near.org/transactions/${hash}`;

export const explorerUrl = (address: string) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

export const getPublicKey = (secretKey: string) =>
  KeyPair.fromString(secretKey).getPublicKey().toString();

export const getPrettyPublicKey = (secretKey: string) =>
  KeyPair.fromString(secretKey).getPublicKey().toString().slice(8);

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

// Generate a random alphanumeric account address for use with the Staking API demo app
// NEAR addresses MUST be:
// lowercase, alphanumeric, 2-64 characters, no special characters except _ or -
function randomAccountName(length: number) {
  if (length < 2 || length > 64) return;
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLowerCase();
}

export default async function createAccount(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {

    let publicKey;
    let secret;
    let pubkey;
    let account;

    const generatedAccountId = `${randomAccountName(24)}.testnet`
    const keypair = KeyPair.fromRandom('ed25519');
    publicKey = keypair.getPublicKey();
    secret = keypair.toString();
    pubkey = keypair.getPublicKey().toString();
    const near = await connect(nearConfig());
    // The near-api-js createAccount method takes a PublicKey, not a string!
    await near.createAccount(generatedAccountId, publicKey);
    const accountInfo = await near.account(generatedAccountId);
    account = accountInfo.accountId
    // @ts-ignore
    return res.status(200).json({secret, pubkey, account});
}
