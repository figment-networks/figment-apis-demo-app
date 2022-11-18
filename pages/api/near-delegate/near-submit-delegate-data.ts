import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';

// Currently using dotenv - could be upgraded to an API Proxy.
import * as dotenv from 'dotenv';
dotenv.config();

export default async function connection(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const body = req.body;
    const HOSTNAME = "near-slate.datahub.figment.io";
    const ENDPOINT = `/api/v1/flows/${body.flow_id}/next`;

    let id;

    try {
        const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
            method: 'PUT',
            headers: {
                "Authorization" : process.env.API_KEY as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": body.action,
                "inputs": {
                    "delegator_address": body.delegator_address,
                    "delegator_pubkey": body.delegator_pubkey,
                    "validator_address": body.validator_address,
                    "amount": body.amount,
                    "max_gas": body.max_gas
                }
            })
        })

        if (response.status >= 400) {
            res.status(200).json(await response.json())

            throw new Error(`${response.status} response from server: ${JSON.stringify(response.body, null, 2)}`);
        }

        if (response.status === 200) {
            res.status(200).json(await response.json())
        }
        
    } catch (err) {
        console.error(err);
    }

}
