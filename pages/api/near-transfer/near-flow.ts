import { NextApiRequest, NextApiResponse } from "next";
import fetch from "cross-fetch";
import * as dotenv from "dotenv";
dotenv.config();

export default async function connection(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = "/api/v1/flows";
  const body = req.body;
  let id;
  console.log(body);
  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: process.env.API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flow: {
          network_code: body.network_code,
          chain_code: body.chain_code,
          operation: body.operation,
          version: body.version,
        },
      }),
    });

    console.log("Response: ", response);

    if (response.status >= 400) {
      console.log(await response.text());
      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body
        )}`
      );
    }

    if (response.status === 200) {
      const respo = await response.json();
      console.log(respo.id);
      id = respo.id;
      // @ts-ignore
      res.status(200).json({ respo, id });
    }
  } catch (err) {
    console.log("POP");
    console.error(err);
  }
}
