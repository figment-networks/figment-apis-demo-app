# Figment APIs Demo App

Welcome to the Figment Staking API demo app. The goal is to get you up and running with our Staking API in 30 minutes or less!

## Prerequisites

- A code editor, such as [VSCode](https://code.visualstudio.com)
- An up to date version of [git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) v14+, which is bundled with the `npm` package manager

### Demo App Tutorial

#### 1. Clone Repo

`git clone git@github.com/figment-networks/figment-apis-demo-app.git`

#### 2. Enter Directory

`cd figment-apis-demo-app`

#### 3. Install dependencies

`npm install`

#### 4. Open Tutorial Branch

`git switch tutorial`

#### 5. Add Figment API Key

`mv .env-example .env` &rarr; Renames the file to `.env`

Paste a valid Figment API key after the variable `API_KEY=`

**Note**: The `.env` file is already included in the `.gitignore` file.
Once you have added your API key, make sure to keep it safe to avoid exposing it.
Check out Figment's [API Key Best Practices](https://docs.figment.io/guides/manage-and-secure-api-keys#api-key-best-practices).

#### 6. Get Started

Open `tutorial.md` & follow the steps.

#### 7. Run the Demo App

Ensure you have completed the tutorial and added a Figment API key to `.env` _before_ you run the server.

`npm run dev` &rarr; starts the Next.js Development server at [http://localhost:3000](http://localhost:3000)

## Private Keys Disclaimer

The code in `pages/api/createAccount.js` creates a randomly generated account ID and keypair. The private key for this account is kept in the local storage of your web browser when running the demo. While this facilitates the demo experience, it's not a secure pattern for production-grade apps.

**The keypairs used in this demo app are for use on the NEAR testnet only!**

In production, private keys should never be exposed, shared, and _especially not_ stored in browser local storage. Instead, you can use an encrypted secrets vault such as Hashicorp's [Vault Project](https://www.vaultproject.io/).

If you have any questions about keypairs on NEAR, please take a moment to familiarize yourself with the [NEAR account model](https://docs.near.org/concepts/basics/accounts/model) before proceeding.
