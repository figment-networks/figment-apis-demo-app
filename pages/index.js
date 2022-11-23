import { useEffect } from "react";
import Footer from "../components/Footer";
import MetaData from "../components/Metadata";
import useAppState from "../utilities/useAppState";
import Header from "../components/Header";
import { DECIMALS } from "../utilities/nearConfig";
import slate from "@figmentio/slate";
import AccountCard from "../components/AccountCard";

export default function Home() {
  const { appState, setAppState, clearAppState } = useAppState();
  const { loaded, accountId, publicKey, secretKey, available, staked } = appState;

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
   * @callback waitForDelegation - waits for broadcasted tx to reach delegated state
   * @callback updateBalances - runs after broadcasted tx is delegated updating appState.available && appState.staked
   * @modifies {object} appState - updates the available && staked balances via updateBalances
   * @throws {Response} throws response object if the delegateFlow, submitData or broadcastTx requests fails 
   */
  async function delegate(amount) {
    let response;

    // create the flow
    response = await fetch("/api/delegateFlow", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        network_code: "cosmos",
        chain_code: "testnet",
        operation: "staking",
        version: "v1"
      })
    });

    if (!response.ok) throw new Error(response);
    
    // submit the data
    const { id: flow_id, actions } = await response.json();

    response = await fetch("/api/submitData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        name: actions[0].name,
        inputs: {
          delegator_address: appState.accountId,
          delegator_pubkey: appState.publicKey,
          validator_address: 'legends.pool.f863973.m0',
          amount,
          max_gas: null
        }
      })
    });

    if (!response.ok) throw new Error(response);

    // sign the transaction
    const { data } = await response.json();
    // const transaction_payload = data.delegate_transaction.raw;
    const signed_payload = await slate.sign("near", "v1", transaction_payload, [secretKey]);

    // broadcast the signed transaction
    response = await fetch('/api/broadcastTx', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        signed_payload,
      })
    });

    if (!response.ok) throw new Error(response);

    // wait for delegated state
    const { id } = await response.json();
    await waitForDelegation(id);

    // update the balances
    await updateBalances();
  }

  /**
   * updateBalances 
   * @description updates the available and staked balances in the appState
   * @modifies {object} appState - updates staked and available properties with current balances
   * @throws {Response} throws response object if the getNearBalance request fails 
   */
  async function updateBalances() {
    if (!accountId) return;
    const response = await fetch('/api/getNearBalance?account=' + accountId);
    if (!response.ok) throw new Error(response);

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

  /**
   * waitForDelegation
   * @description returns a Promise that runs every five seconds, resolving when a transaction state is shown to be delegated
   * @param {string} txId - the transaction id for the transaction to monitor for delegate state
   * @param {function} resolve - the resolve function used to finalize initial Promise  the state of a flow
   * @throws {string} throws missing tx id if called without a transaction to monitor
   * @throws {Response} throws response object if the getFlowState request fails 
   * @returns {Promise} returns a promise that resolves when txId's state is equal to 'delegated'
   */
  async function waitForDelegation(txId, resolve) {
    if (!txId) throw Error('missing tx id');

    // if there's no resolve parameter it's not initialized yet
    // return a Promise recursively calls this function w/txId and resolve
    if (!resolve) return new Promise((resolve, reject) => {
      waitForDelegation(txId, resolve);
    });

    const response = await fetch(`/api/getFlowState?flow_id=${txId}`);
    if (!response.ok) throw new Error(response);
    const { state } = await response.json();
    if (state === 'delegated') return resolve();

    // flow state isn't delegated, try again in 5 seconds
    return setTimeout(() => {
      waitForDelegation(txId, resolve);
    }, 5000);
  }

  // on initial load update the balance
  useEffect(() => {
    if (loaded && accountId) updateBalances();
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
        />
      </main>
      <Footer />
    </>
  )
}
