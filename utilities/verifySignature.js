const crypto = require('crypto').webcrypto;
const TOLERANCE = 300

export default async function verifySignature(secret, header, body) {
    // get the time from the header
    const timestamp = header.match(/t=([^,\s*]+)/)[1];

    // get all signatures in Unit8Array format
    const signatures = [ ...header.matchAll(/v\d+=([^,\s*]+)/g) ].map(match => {
        return new Uint8Array(Math.ceil(match[1].length / 2))
            .map((v, i) => parseInt(match[1].substr(i * 2, 2), 16))
    });

    // init text encoder
    const encoder = new TextEncoder();

    // construct the cyptographic key
    const key = await crypto.subtle.importKey(
        "raw", 
        encoder.encode(secret), 
        { name: "HMAC", hash: "SHA-256" }, 
        false, 
        ["verify"]
    );

    // verify that at least one signature is valid
    const verified = (await Promise.all(signatures.map(async signature => {
        return await crypto.subtle.verify(
            "HMAC",
            key,
            signature,
            encoder.encode(`${timestamp}.${body}`)
        )
    }))).includes(true);

    // check if elapsed timestamp is within tolerance
    const elapsed = Math.floor(Date.now() / 1000) - Number(timestamp);
    const withinTolerance = !(TOLERANCE && elapsed > TOLERANCE);

    // return validity
    return verified && withinTolerance;
}
