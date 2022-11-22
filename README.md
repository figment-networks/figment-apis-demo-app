# Figment Staking API Demo App

Welcome to the Figment Staking API demo app. The goal is to get you up and running with our Staking API in 30 minutes or less!

## Running The Demo

1. Clone the repository with git & change working directory &rarr; `git clone git@github.com/figment-networks/staking-api-demo-app.git && cd staking-api-demo-app`
2. Install dependencies with npm &rarr; `npm install`
3. Insert a valid Figment API key in the file `.env-example` and then rename the file to `.env` with the command `mv .env-example .env`.

- Note that the `.env` file is already included in the `.gitignore` file. Once you have added your API key, make sure to keep it safe to avoid exposing it.

With the API key in place, run the Next.js Development server &rarr; `npm run dev`, which will start the demo app on your localhost at `https://localhost:3000`.

## Private Keys Disclaimer

The code in `pages/create-near-account.tsx` creates a randomly generated account. The private key for this account is kept in the local storage of your web browser when running the demo. While this facilitates the demo experience, it's not a secure pattern for production-grade apps.

**The keypairs used in this demo app are for use on the NEAR testnet only!**

In production, private keys should never be exposed, shared, and _especially not_ stored in browser local storage. Instead, you can use an encrypted secrets vault such as Hashicorp's [Vault Project](https://www.vaultproject.io/).

If you have any questions about keypairs on NEAR, please take a moment to familiarize yourself with the [NEAR account model](https://docs.near.org/concepts/basics/accounts/model) before proceeding.
