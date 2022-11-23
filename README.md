# Figment APIs Demo App

Welcome to the Figment Staking API demo app. The goal is to get you up and running with our Staking API in 30 minutes or less!

## Prerequisites

- Your favorite code editor, we recommend [VSCode](https://code.visualstudio.com)
- An up to date version of [git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) v14+
  - We recommend using the `npm` package manager, because it is bundled with Node.js

## Demo App Tutorial

1. Clone this repository with git and change your working directory &rarr; `git clone git@github.com:figment-networks/figment-apis-demo-app.git && cd figment-apis-demo-app`
2. To start the tutorial, switch to the `tutorial` branch &rarr; `git switch tutorial`
3. Begin the tutorial by opening `tutorial.md` in your code editor
4. Following the steps in the tutorial will guide you through the entire process of using the Staking API
5. When you have completed the tutorial, you can run the demo app by following the steps below

## Running The Demo App

1. Install dependencies with npm &rarr; `npm install`
2. Rename the `.env-example` file to `.env` with the command `mv .env-example .env` &rarr; paste a valid Figment API key and save the `.env` file
3. With the API key in place, run the Next.js Development server &rarr; `npm run dev`, which will start the demo app on your localhost at [http://localhost:3000](http://localhost:3000)

Note that the `.env` file is already included in the `.gitignore` file. Once you have added your API key, make sure to keep it safe to avoid exposing it. Check out Figment's [API Key Best Practices](https://docs.figment.io/guides/manage-and-secure-api-keys#api-key-best-practices).

## Private Keys Disclaimer

The code in `pages/api/createAccount.js` creates a randomly generated account ID and keypair. The private key for this account is kept in the local storage of your web browser when running the demo. While this facilitates the demo experience, it's not a secure pattern for production-grade apps.

**The keypairs used in this demo app are for use on the NEAR testnet only!**

In production, private keys should never be exposed, shared, and _especially not_ stored in browser local storage. Instead, you can use an encrypted secrets vault such as Hashicorp's [Vault Project](https://www.vaultproject.io/).

If you have any questions about keypairs on NEAR, please take a moment to familiarize yourself with the [NEAR account model](https://docs.near.org/concepts/basics/accounts/model) before proceeding.
