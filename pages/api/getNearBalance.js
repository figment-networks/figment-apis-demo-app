import { connect } from "near-api-js";
import nearConfig from "../../utilities/nearConfig";

export default async function (req, res) {
  try {
    if (!req.query.account) return res.status(406).send("missing account id");
    const client = await connect(nearConfig);
    const account = await client.account(req.query.account);
    const availableBalance = await account.getAccountBalance();
    const stakedBalance = await account.getActiveDelegatedStakeBalance();
    const available = availableBalance ? Number.parseFloat(availableBalance.total) : 0;
    const staked = stakedBalance ? Number.parseFloat(stakedBalance.total) : 0;
    return res.status(200).json({available, staked});
  } catch(error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}
