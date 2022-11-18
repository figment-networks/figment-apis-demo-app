import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';

// You must add a valid Figment API key as API_KEY in /.env
import * as dotenv from 'dotenv';
dotenv.config();

export default async function connection(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const body = req.body;
    const HOSTNAME = "near-slate.datahub.figment.io";
    const ENDPOINT = `/api/v1/flows/${body.flow_id}/next`;

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
                    "from_account_pubkey": body.from_account_pubkey,
                    "from_account_address": body.from_account_address,
                    "to_account_address": body.to_account_address,
                    "amount": body.amount
                }
            })
        })

        if (response.status >= 400) {
            res.status(200).json(await response.json())
            throw new Error(`${response.status} response from server: ${JSON.stringify(response.body)}`);
        }

        if (response.status === 200) {
            res.status(200).json(await response.json())
        }
    } catch (err) {
        console.error(err);
    }
}
