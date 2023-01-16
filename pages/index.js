import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MetaData from "../components/Metadata";
import useAppState from "../utilities/useAppState";
import Header from "../components/Header";
import { DECIMALS } from "../utilities/nearConfig";
import slate from "@figmentio/slate";
import AccountCard from "../components/AccountCard";
import { ethers, utils } from "ethers";

export default function Home() {
  const [ delegating, setDelegating ] = useState(false);
  const { appState, setAppState, clearAppState } = useAppState();
  const { loaded, accountAddress, publicKey, privateKey, available, staked, latestBlock } =
    appState;

  /**
   * createAccount
   * @description creates a new near protocol account
   * @modifies {object} appState - sets the accountAddress, publickey, privateKey for the new account
   * @throws {Response} throws response object if the createAccount request fails
   */
  async function createAccount() {
    // create account
    const response = await fetch("/api/eth/createEthAccount", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw new Error(response);

    // update the app state with the accountAddress and keypair
    const { publicKey, privateKey, accountAddress } = await response.json();
    setAppState({ publicKey, privateKey, accountAddress });
  }

  /**
   * delegate
   * @description delegates a given amount of tokens to a node for staking
   * @param {float} amount - the amount of ETH to be staked
   * @callback updateBalances - runs after broadcasted tx is delegated updating appState.available && appState.staked
   * @modifies {object} appState - updates the available && staked balances via updateBalances
   * @throws {Response} throws response object if the delegateFlow, submitData or broadcastTx requests fails
   */
  async function delegate(amount) {
    let response;
    let signed_payload;

    // create the flow
    response = await fetch("/api/eth/delegateFlow", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        network_code: "ethereum",
        chain_code: "goerli",
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

    // a validator address must be provided by Figment
    const validator_address = "TBD";

    response = await fetch("/api/eth/submitData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flow_id,
        name: name, // create_deposit_tx
        inputs: {
          funding_account_address: appState.accountAddress,
          validator_pub_key: appState.publicKey,
          withdrawal_credentials: validator_address,
          signature: appState.depositSignature,
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
      signed_payload = await slate.sign("ethereum", "v1", transaction_payload, [
        privateKey,
      ]);
    }

    // This webhook will notify us when the delegation is complete
    // Read more at https://docs.figment.io/guides/staking-api/staking-api-endpoints#managing-webhooks
    setDelegating(true)
    const eventSource = new EventSource("/api/webhook");
    eventSource.onmessage = (msg) => {
      const { state, message } = JSON.parse(msg.data)
      console.log(message)
      if (state === 'deposited') {
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
   * @throws {Response} throws response object if the getEthBalance request fails
   */
  async function updateBalances() {
    if (!accountAddress) return;
    const response = await fetch("/api/eth/getEthBalance?accountAddress=" + accountAddress);
    
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { available, staked, latestBlock } = await response.json();

    console.log("Available / Staked: ", available, staked)
    console.log("Latest ETH block number: ", latestBlock)

    const update = {
      available,
      staked,
      latestBlock,
    };

    setAppState({
      ...appState,
      ...update,
    });
  }

  // on initial load update the balance
  const [ started, setStarted ] = useState(false)
  useEffect(() => {
    if (loaded && accountAddress) updateBalances();
    if (started) return;
    setStarted(true);
  }, [loaded, accountAddress]);

  // these components are defined in the /components directory
  return (
    <>
      <MetaData />
      <Header
        accountAddress={accountAddress}
        loaded={loaded}
        onLogout={clearAppState}
        onCreate={createAccount}
      />
      <main>
        <AccountCard
          loaded={loaded}
          accountAddress={accountAddress}
          publicKey={publicKey}
          available={available}
          staked={staked}
          latestBlock={latestBlock}
          onDelegate={delegate}
          delegating={delegating}
        />
      </main>
      <Footer />
    </>
  );
}
