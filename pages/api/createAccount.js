import { KeyPair, connect } from "near-api-js";
import nearConfig from "../../utilities/nearConfig";
import crypto from "crypto";

export default async function createAccount(req, res) {
  const keypair = KeyPair.fromRandom("ed25519");
  const accountId = `${crypto.randomBytes(24).toString("hex")}.testnet`;
  const publicKey = keypair.getPublicKey();
  const secretKey = keypair.toString();
  const client = await connect(nearConfig);
  await client.createAccount(accountId, publicKey);
  return res
    .status(200)
    .json({ secretKey, publicKey: publicKey.toString(), accountId });
}
