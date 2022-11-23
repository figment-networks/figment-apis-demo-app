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
   * creates a randomly generated NEAR testnet account
   * @returns {object} - accountId, publickey, secretKey
   */
  async function createAccount() {
    const response = await fetch("/api/createAccount", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw Error(response.statusText);
    const { accountId, publicKey, secretKey } = await response.json();
    setAppState({ accountId, publicKey, secretKey });
  }

  /**
   * delegates tokens to a node for staking
   */
  async function delegate(amount) {
    let response

    setAppState({ ...appState });

    response = await fetch("/api/delegateFlow", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        network_code: "near",
        chain_code: "testnet",
        operation: "staking",
        version: "v1"
      })
    });

    const { id: flow_id, actions } = await response.json()
    const validator_address = 'legends.pool.f863973.m0'

    response = await fetch("/api/submitData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        name: actions[0].name,
        inputs: {
          delegator_address: appState.accountId,
          delegator_pubkey: appState.publicKey,
          validator_address: validator_address,
          amount,
        }
      })
    })

    if (!response.ok) alert('yo')

    const { data } = await response.json();
    const transaction_payload = data.delegate_transaction.raw;
    const signed_payload = await slate.sign("near", "v1", transaction_payload, [secretKey]);

    response = await fetch('/api/broadcastTx', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        signed_payload,
      })
    });

    if (!response.ok) alert('yo');

    const { id } = await response.json();

    await waitForDelegation(id);
    await updateBalances();
  }

  /**
   * updates the available balance to stake and current staked balance
   */
  async function updateBalances() {
    if (!accountId) return
    const result = await fetch('/api/getNearBalance?account=' + accountId)
    const json = await result.json()
    const { available, staked } = json
    const update = {
      available: parseFloat((parseFloat(available) / DECIMALS).toFixed()),
      staked: parseFloat((parseFloat(staked) / DECIMALS).toFixed()),
    }

    setAppState({
      ...appState,
      ...update,
    });

    return update
  }

  /**
   * get the state of a flow
   *  - when the transaction has been broadcast and is awaiting conformation the state is "delegate_tx_broadcast"
   *  - when the transaction is confirmed on-chain the state becomes "delegated"
   */
  async function waitForDelegation(transaction, resolve) {
    if (!transaction) throw Error('missing tx id');

    if (!resolve) return new Promise((resolve, reject) => {
      waitForDelegation(transaction, resolve)
    })

    // comment this - check the current status if delegated finish waiting by resolving the promise
    const result = await fetch(`/api/getFlowState?flow_id=${transaction}`);
    if (!result.ok) alert('error');
    const { state } = await result.json();
    if (state === 'delegated') return resolve();

    else return setTimeout(() => {
      waitForDelegation(transaction, resolve);
    }, 5000);
  }

  useEffect(() => {
    if (loaded && accountId) updateBalances()
  }, [loaded, accountId])

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
