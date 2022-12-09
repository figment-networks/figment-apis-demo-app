# Figment APIs Demo App

Welcome to the Figment Staking API demo app. The goal is to get you up and running with our Staking API in 30 minutes or less!

We will assemble a basic single page web application which uses Figment's Staking API to provide users with the ability to stake or "delegate" NEAR tokens with a single click. When it is running, the application looks like this:

![Demo App Screenshot](/public/img/demo-app-screenshot1.png)
![Demo App Screenshot](/public/img/demo-app-screenshot2.png)

## Requirements

- An up to date version of [git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) v14+, which is bundled with the `npm` package manager

# Demo App Tutorial

The tutorial consists of a series of steps to integrate the Staking API into a simple app.
The repo includes two branches `tutorial` and `main`.
The `tutorial` branch guides you through the integration process.
The `main` branch contains the app with the Staking API already integrated.

### 1. Clone Repo

`git clone git@github.com:figment-networks/figment-apis-demo-app.git`

### 2. Enter Directory

`cd figment-apis-demo-app`

### 3. Install Dependencies

`npm install`

### 4. Open Tutorial Branch

`git switch tutorial`

### 5. Add Figment API Key

`mv .env-example .env` &rarr; Renames the file to `.env`

Paste a valid Figment API key after the variable `API_KEY=`

If you don't already have an API key, reach out to Figment.

**Note**: The `.env` file is already included in the `.gitignore` file.
Once you have added your API key, make sure to keep it safe to avoid exposing it.
Check out Figment's [API Key Best Practices](https://docs.figment.io/guides/manage-and-secure-api-keys#api-key-best-practices).

### 6. Run the Demo App

Ensure you have added a Figment API key to `.env` _before_ you run the server.

`npm run dev` &rarr; starts the Next.js Development server and opens a secure tunnel in a separate process to provide the Staking API an accessible endpoint for webhook callbacks.

**Access the client-side of the demo via [localhost:3000](https://localhost:3000), the tunneled URL is required to receive events from the Staking Webhooks API.**

### 7. Get Started

Open `tutorial.md` & follow the steps.

You can also view the tutorial on GitHub [here](https://github.com/figment-networks/figment-apis-demo-app/blob/tutorial/tutorial.md)

## Private Keys Disclaimer

The code in `pages/api/createAccount.js` creates a randomly generated account ID and keypair. The private key for this account is kept in the local storage of your web browser when running the demo. While this facilitates the demo experience, it's not a secure pattern for production-grade apps.

**The keypairs used in this demo app are for use on the NEAR testnet only!**

In production, private keys should never be exposed, shared, and _especially not_ stored in browser local storage.

If you have any questions about keypairs on NEAR, please take a moment to familiarize yourself with the [NEAR account model](https://docs.near.org/concepts/basics/accounts/model) before proceeding.
