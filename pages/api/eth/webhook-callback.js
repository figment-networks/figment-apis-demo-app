import cache from "memory-cache"
import verifySignature from "../../utilities/verifySignature"

async function unsubscribe(webhookId) {
    const result = await fetch(`https://near-slate.datahub.figment.io/api/v1/webhook_endpoints/${webhookId}`, {
        method: 'DELETE',
        headers: {
            Authorization: process.env.API_KEY
        }
    })
    return result.ok
}

async function handler(req, res) {
    const { body, headers } = req
    const whSecret = cache.get('webhookSecret')
    const whHeader = headers['slate-signature']
    const whBody = JSON.stringify(body)
    // Webhooks use HMAC signatures for verification
    // Read more at https://docs.figment.io/guides/staking-api/staking-api-webhooks#hmac
    const verified = await verifySignature(whSecret, whHeader, whBody)
    
    // The inbound request is not legitimate - exit early
    if (!verified) return res.json({ ok: true })
    
    const resolve = cache.get('resolve')
    const { status, event_type } = body
    const isDelegated = status === 'success' && event_type === 'eth.staking.delegate_tx.confirmed'
    if (isDelegated) {
        resolve()
        await unsubscribe(cache.get('webhookId'))
        cache.close()
    }
    return res.json({ ok: true })
}

export default handler