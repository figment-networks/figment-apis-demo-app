import { NextApiRequest, NextApiResponse } from "next";
import fetch from "cross-fetch";
import * as dotenv from "dotenv";
dotenv.config();

export default async function connection(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body?.flow_id}/next`;

  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "sign_withdraw_tx",
        inputs: {
          transaction_payload: body.signed_payload,
        },
      }),
    });

    console.log("Response: ", response);

    if (response.status >= 400) {
      res.status(200);

      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body,
          null,
          2
        )}`
      );
    }

    if (response.status === 200) {
      // @ts-ignore
      res.status(200).json(await response.json());
    }
  } catch (err) {
    console.error(err);
  }
}
