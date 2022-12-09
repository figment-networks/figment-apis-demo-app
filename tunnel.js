const localtunnel = require('localtunnel');
const updateDotenv = require('update-dotenv');

(async () => {
    const tunnel = await localtunnel({ port: 3000 });
    console.log(tunnel.url)
    await updateDotenv({ ORIGIN: tunnel.url });
})();