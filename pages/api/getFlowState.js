export default async function getFlowState(req, res) {
    const { flow_id } = req.query;
    if (!flow_id) {
        return res.status(406).send('missing params');
    }
    const response = await fetch(`https://near-slate.datahub.figment.io/api/v1/flows/${flow_id}`, {
        method: "GET",
        headers: {
            Authorization: process.env.API_KEY,
        }
    });

    if (!response.ok) {
        return res.status(500).send({ ok: false, message: response.statusText });
    }

    return res.status(200).json(await response.json())
}
