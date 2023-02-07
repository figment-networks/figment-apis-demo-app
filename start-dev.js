const spawn = require('child_process').spawn;

 // Spawn a secure tunnel in a separate process
const tunnel = spawn('node', ['tunnel.js']);

console.log(
  "Secure tunnel provided by https://github.com/localtunnel/localtunnel\n" + 
  "If the tunnel has not launched within 10 seconds,\n" + 
  "please check https://github.com/localtunnel/localtunnel/issues\n\n" +
  "Waiting for secure tunnel...\n"
)

tunnel.stdout.on('data', (data) => {
  console.log(`secure tunnel launched at: ${data}`);
  // Spawn the Next.js Development Server once tunnel is up and .env is set
  const next = spawn('next', ['dev']); 
  next.stdout.on('data', (data) => {
    console.log(`${data}`);
  });  
});
