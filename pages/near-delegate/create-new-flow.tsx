import Link from "next/link";
import { FormEvent } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from "next/router";
import { useAppState } from "../../components/AppState"

export default function CreateNearFlow() {
  const router = useRouter();
  
  // @ts-ignore
  const { appState, setAppState } = useAppState();

  const handleNextPage = async () => {
    router.push(`/near-delegate/submit-data`);
  };

  const handleSubmit = async (event: FormEvent) => {
    // preventDefault is part of the React event system and is
    // used to prevent the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an HTML form.
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      network_code: form.network_code.value as string,
      chain_code: form.chain_code.value as string,
      operation: form.operation.value as string,
      version: form.version.value as string,
    };

    // Send the form data to our API and get a response.
    // route is passed into the component as a property
    const response = await fetch(`/api/near-delegate/near-flow`, {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // The body of the request is the JSON data we created above.
      body: JSON.stringify(data),
    });

    // Get the response data from server as JSON.
    const result = await response.json();

    // Add response and flow ID into the app state.
    setAppState({ ...appState, flowId: result.id });
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Create New Delegation Flow</h1>

      <p className={styles.description}>
        The Staking API supports several networks. This demo app highlights NEAR
        (to avoid using a testnet faucet to obtain tokens).
        <br />
        <br />
        When creating a flow with the Staking API, simply pass the Network,
        Chain Code, Operation and API Version. <br />
        <b>NEAR</b>, <b>Testnet</b>, <b>Staking</b> and{" "}
        <b>v1</b> have been preselected for this demonstration. <br />
        Click <b>Create Flow</b> to continue.
      </p>

      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="network_code">Network</label>
        <select
          id="network_code"
          name="networkCode"
          required
          defaultValue="near"
        >
          <option disabled value="avalanche">
            Avalanche
          </option>
          <option disabled value="cosmos">
            Cosmos
          </option>
          <option disabled value="ethereum">
            Ethereum
          </option>
          <option value="near">NEAR</option>
          <option disabled value="polkadot">
            Polkadot
          </option>
          <option disabled value="polygon">
            Polygon
          </option>
          <option disabled value="solana">
            Solana
          </option>
        </select>

        <label htmlFor="chain_code">Chain Code</label>
        <select
          id="chain_code"
          name="chainCode"
          required
          defaultValue="testnet"
        >
          <option disabled value="mainnet">
            Mainnet
          </option>
          <option value="testnet">Testnet</option>
        </select>

        <label htmlFor="operation">Operation</label>
        <select id="operation" name="operation" required defaultValue='staking'>
          <option value="staking">
            Staking
          </option>
          <option disabled value="unstaking">
            Unstaking
          </option>
          <option disabled value="transfer">
            Transfer
          </option>
        </select>

        <label htmlFor="version">Version</label>
        <select id="version" name="version" required defaultValue="v1">
          <option value="v1">v1</option>
        </select>

        <button type="submit" disabled={appState.flowId}>
          Create Flow
        </button>
      </form>
      <br />
      {appState.flowId ? (
        <>
          <span>{`Created flow with ID: ${appState.flowId}`}</span>
          <button className="nextPage" type="button" onClick={handleNextPage}>
            Next Step
          </button>
        </>
      ) : (
        <></>
      )}

      <Link rel="noopener noreferrer" target="_blank" href="/tutorial/1_integration">View the tutorial</Link>

      <Link href="/">Return to Main Page</Link>
    </div>
  );
}
