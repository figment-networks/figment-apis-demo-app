export default async function broadCastTx(req, res) {
    const { flow_id, signed_payload } = req.body;

    if (!flow_id || !signed_payload) {
        return res.status(406).send('missing params');
    }

/**
    const response = await fetch(`https://near-slate.datahub.figment.io/api/v1/flows/${flow_id}/next`, {
      method: 'PUT',
      headers: {
        "Authorization": process.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": "sign_delegate_tx",
        "inputs": {
          "transaction_payload": signed_payload
        }
      })
    });
*/

    if (!response.ok) {
        return res.status(406).send({ ok: false, message: response.statusText });
    }

    res.status(200).json(await response.json());
}
