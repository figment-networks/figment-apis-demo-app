import { connect } from 'near-api-js';
import nearConfig from '../../utilities/nearConfig';

export default async function (req, res) {
    if (!req.query.account) return res.status(406).send('missing account id');
    const client = await connect(nearConfig);
    const account = await client.account(req.query.account);
    const balance = await account.getAccountBalance();
    const staked = await account.getActiveDelegatedStakeBalance();
    return res.status(200).json({ 
        available: Number.parseFloat(balance.total || 0),
        staked: Number.parseFloat(staked.total || 0) 
    });
}
