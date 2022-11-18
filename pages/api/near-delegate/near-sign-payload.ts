import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';
const slate = require('@figmentio/slate')

export default async function connection(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const body = req.body;

    /**
     *  Signing with @figmentio/slate:
     * 
     *  - NEAR does not require any options, however networks like Polkadot and Cosmos do
     * 
        exports.sign = async (network, version, payload, privateKeys, options = {}) => {
            const tx = new transactions[network].signing[version].Transaction(payload);
            const result = await tx.sign(privateKeys, options);
        
            return result;
        };
     */

    const signed = await slate.sign("near", "v1", body.transaction_payload, [body.privateKey])

    console.log(signed)

    res.status(200).json(signed as string)
}
