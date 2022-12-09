export default async function submitData(req, res) {
  const { flow_id, ...body } = req.body;

  if (!flow_id) {
    return res.status(406).send("missing flow id");
  }

  const response = await fetch(
    `https://near-slate.datahub.figment.io/api/v1/flows/${flow_id}/next`,
    {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return res.status(500).send({ ok: false, message: response.statusText });
  }

  res.status(200).send(await response.json());
}
