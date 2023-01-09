export default async function delegateFlow(req, res) {
    let body = req.body;
  
    if (!process.env.API_KEY) {
      throw new Error(
        "Error: Please add a valid Figment API key to .env and try again!"
      );
    }
  
    const response = await fetch(
      `https://eth-slate.datahub.figment.io/api/v1/flows`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.API_KEY,
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
      }
    );
  
    if (!response.ok) {
      return res.status(500).json({ ok: false, message: response.statusText });
    }
  
    return res.status(200).json(await response.json());
  }
  