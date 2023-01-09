import cache from "memory-cache"

async function subscribe(req, res) {
  const result = await fetch('https://eth-slate.datahub.figment.io/api/v1/webhook_endpoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY
    },
    body: JSON.stringify({
      target_url: `${process.env.ORIGIN}/api/webhook-callback`,
      event_types: ["*"],
      enabled: true,
    })
  })
  if (!result.ok) return result
  return await result.json()
}

const handler = async (req, res) => {
  const { id, secret } = await subscribe();
  if (!id) return res.status(500).send('failed to set webhook')
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  
  cache.put('webhookId', id)
  cache.put('webhookSecret', secret)
  cache.put('resolve', function () {
    res.write(`data: { "state": "delegated", "id": ${id}, "message": "stake delegated" }\n\n`);
    res.end('done\n');
  })

  res.write(`data: { "state": "opened", "message": "event stream open" }\n\n`);
};

export default handler;