import {keyStores, ConnectConfig, KeyPair, connect} from 'near-api-js';
import {InMemoryKeyStore} from 'near-api-js/lib/key_stores';

export const transactionUrl = (hash: string) =>
  `https://explorer.testnet.near.org/transactions/${hash}`;

export const explorerUrl = (address: string) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

export default async function createAccount(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const body = req.body;
    const response = await fetch(`https://near-testnet--rpc.datahub.figment.io`, {
        method: 'POST',
            headers: {
                "Authorization" : process.env.API_KEY as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tx",
                    "params" : [
                      body.hash,
                      body.account_address
                    ]
                
            })
        })

        console.log("Response: ", response)
        
    return res.status(200).json(await response.json());
}
