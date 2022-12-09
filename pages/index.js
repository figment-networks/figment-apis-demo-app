import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MetaData from "../components/Metadata";
import useAppState from "../utilities/useAppState";
import Header from "../components/Header";
import { DECIMALS } from "../utilities/nearConfig";
import slate from "@figmentio/slate";
import AccountCard from "../components/AccountCard";

export default function Home() {
  const [ delegating, setDelegating ] = useState(false);
  const { appState, setAppState, clearAppState } = useAppState();
  const { loaded, accountId, publicKey, secretKey, available, staked } =
    appState;

  /**
   * createAccount
   * @description creates a new near protocol account
   * @modifies {object} appState - sets the accountId, publickey, secretKey for the new account
   * @throws {Response} throws response object if the createAccount request fails
   */
  async function createAccount() {
    // create account
    const response = await fetch("/api/createAccount", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw new Error(response);

    // update the app state with the accountId and keypair
    const { accountId, publicKey, secretKey } = await response.json();
    setAppState({ accountId, publicKey, secretKey });
  }

  /**
   * delegate
   * @description delegates a given amount of tokens to a node for staking
   * @param {float} amount - the amount of NEAR to be staked
   * @callback updateBalances - runs after broadcasted tx is delegated updating appState.available && appState.staked
   * @modifies {object} appState - updates the available && staked balances via updateBalances
   * @throws {Response} throws response object if the delegateFlow, submitData or broadcastTx requests fails
   */
  async function delegate(amount) {
    let response;
    let signed_payload;

    // create the flow
    response = await fetch("/api/delegateFlow", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        network_code: "near",
        chain_code: "testnet",
        operation: "staking",
        version: "v1",
      }),
    });

    if (!response.ok) {
      throw new Error(
        "missing API_KEY, wrong network_code, or bad response from /delegateFlow"
      );
    }

    // submit the data
    const { id: flow_id, actions } = await response.json();

    // delegateFlow returns one possible action at index 0
    // get the name to describe the action when submitting data
    const { name } = actions[0];

    // a list of validators can be found at https://explorer.testnet.near.org/nodes/validators
    const validator_address = "legends.pool.f863973.m0";

    response = await fetch("/api/submitData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        name: name,
        inputs: {
          delegator_address: appState.accountId,
          delegator_pubkey: appState.publicKey,
          validator_address: validator_address,
          amount,
          max_gas: null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("/submitData code not completed or bad payload data");
    }

    // sign the transaction
    const { data } = await response.json();
    const transaction_payload = data.delegate_transaction.raw;

    if (!transaction_payload) {
      throw new Error("transaction_payload is not defined!");
    } else {
      signed_payload = await slate.sign("near", "v1", transaction_payload, [
        secretKey,
      ]);
    }

    // This webhook will notify us when the delegation is complete
    // Read more at https://docs.figment.io/guides/staking-api/staking-api-endpoints#managing-webhooks
    setDelegating(true)
    const eventSource = new EventSource("/api/webhook");
    eventSource.onmessage = (msg) => {
      const { state, message } = JSON.parse(msg.data)
      console.log(message)
      if (state === 'delegated') {
        updateBalances()
        setDelegating(false)
        eventSource.close()
      }
    };

    // broadcast the signed transaction
    response = await fetch("/api/broadcastTx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        signed_payload,
      }),
    });

    if (!response.ok) {
      throw new Error("/broadcastTx code not completed or bad payload data");
    }
  }

  /**
   * updateBalances
   * @description updates the available and staked balances in the appState
   * @modifies {object} appState - updates staked and available properties with current balances
   * @throws {Response} throws response object if the getNearBalance request fails
   */
  async function updateBalances() {
    if (!accountId) return;
    const response = await fetch("/api/getNearBalance?account=" + accountId);
    
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { available, staked } = await response.json();

    const update = {
      available: parseFloat((parseFloat(available) / DECIMALS).toFixed()),
      staked: parseFloat((parseFloat(staked) / DECIMALS).toFixed()),
    };

    setAppState({
      ...appState,
      ...update,
    });
  }

  // on initial load update the balance
  const [ started, setStarted ] = useState(false)
  useEffect(() => {
    if (loaded && accountId) updateBalances();
    if (started) return;
    setStarted(true);
  }, [loaded, accountId]);

  // these components are defined in the /components directory
  return (
    <>
      <MetaData />
      <Header
        accountId={accountId}
        loaded={loaded}
        onLogout={clearAppState}
        onCreate={createAccount}
      />
      <main>
        <AccountCard
          loaded={loaded}
          accountId={accountId}
          publicKey={publicKey}
          available={available}
          staked={staked}
          onDelegate={delegate}
          delegating={delegating}
        />
      </main>
      <Footer />
    </>
  );
}
