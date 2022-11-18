import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function CreateNearFlow({ route, operation, description }: {route: string, operation: string, description: string}) {
  const router = useRouter()

  const [flowId, setFlowId] = useState("")
  const [staking, setStaking] = useState("")
  const [unstaking, setUnstaking] = useState("")
  const [transfer, setTransfer] = useState("")

  useEffect(() => {
    if (operation === "staking") {
      setStaking("true")
    }
  
    if (operation === "unstaking") {
      setUnstaking("true")
    }
  
    if (operation === "transfer") {
      setTransfer("true")
    }
  }, [operation])

  const handleNextPage = async () => {
    localStorage.setItem(`DEMO_${operation.toUpperCase()}_FLOW`, flowId)
    router.push(`/${route}/submit-data`)
  }

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
      version: form.version.value as string
    }

    // Send the form data to our API and get a response.
    const response = await fetch(`/api/${route}/near-flow`, {
      // The body of the request is the JSON data we created above.
      body: JSON.stringify(data),
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // The method is POST because we are sending data.
      method: "POST",
    });

    // Get the response data from server as JSON.
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2))
    console.log(result.id)
    // Set state so we can display the created flow ID.
    setFlowId("")
    setFlowId(result.id)
    console.log(flowId)
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Create New {description} Flow</h1>

      <p className={styles.description}>
        The Staking API supports several networks. This demo app highlights NEAR (to avoid using a testnet faucet to obtain tokens).

        <br /><br />

        When creating a flow with the Staking API, simply pass the Network, Chain Code, Operation and API Version. <br /> 
        <b>NEAR</b>, <b>Testnet</b>, <b>{operation.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {return match.toUpperCase();})}</b> and <b>v1</b> have been preselected for this demonstration. <br />
        Click <b>Create Flow</b> to continue.
      </p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="network_code">Network</label>
        <select id="network_code" name="networkCode" required defaultValue="near">
          <option disabled value="avalanche">Avalanche</option>
          <option disabled value="cosmos">Cosmos</option>
          <option disabled value="ethereum">Ethereum</option>
          <option value="near">NEAR</option>
          <option disabled value="polkadot">Polkadot</option>
          <option disabled value="polygon">Polygon</option>
          <option disabled value="solana">Solana</option>
        </select>

        <label htmlFor="chain_code">Chain Code</label>
        <select id="chain_code" name="chainCode" required defaultValue="testnet">
          <option disabled value="mainnet">Mainnet</option>
          <option value="testnet">Testnet</option>
        </select>

        <label htmlFor="operation">Operation</label>
        <select id="operation" name="operation" required defaultValue="staking">
          {staking
          ? (<>
            <option value="staking">Staking</option>
            <option disabled value="unstaking">Unstaking</option>
            <option disabled value="transfer">Transfer</option>
          </>)
          : ""
          }
          {unstaking
          ? (<>
            <option disabled value="staking">Staking</option>
            <option value="unstaking">Unstaking</option>
            <option disabled value="transfer">Transfer</option>
          </>)
          : ""
          }
          {transfer
          ? (<>
            <option disabled value="staking">Staking</option>
            <option disabled value="unstaking">Unstaking</option>
            <option value="transfer">Transfer</option>
          </>)
          : ""
          }
        </select>

        <label htmlFor="version">Version</label>
        <select id="version" name="version" required defaultValue="v1">
          <option value="v1">v1</option>
        </select>

        <button type="submit">Create Flow</button>
      </form>

      <br /> 
            {flowId
              ? `Created flow with ID: ${flowId}`
              : ""
            } 

            {flowId
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
              : ""
            }

            <Link href="/">Return to Main Page</Link>
    </div>
  );
}
