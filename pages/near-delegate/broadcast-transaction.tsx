import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'
import { useAppState } from "../../components/AppState";
import Link from "next/link";

export default function BroadcastTx() {
  const router = useRouter()
  // @ts-ignore
  const { appState } = useAppState()
  const [ flowState, setFlowState ] = useState()
  const [ signedTx, setSignedTx ] = useState('')

  const handleNextPage = async () => {
    router.push(`/near-delegate/get-flow-state`)
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      flow_id: appState.flowId,
      action: form.flowAction.value as string,
      signed_payload: form.signed_payload.value as string,
    }

    const response = await fetch(`/api/near-delegate/broadcast-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    // Get the response data from server as JSON.
    const result = await response.json();

    if (result.code) {
      alert(`${result.code}: ${result.message}`)
    }

    if (result.data) {
      console.log("transaction state: ", result.state)
      setFlowState(result.state)
    }

  };
  return (<>
    <div className="container">
      <h1 className={styles.title}>Submit Signed Delegation Transaction for Broadcast</h1>

      <p className={styles.description}>
        After signing the transaction, provide the signed <code>transaction_payload</code>. The Staking API will broadcast the transaction to the NEAR network.
      </p>
      <br /><br />

      <p>Current Flow ID: <b>{appState.flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">

        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="sign_delegate_tx">
          <option value="sign_delegate_tx">sign_delegate_tx</option>
          <option disabled value="refresh_delegate_tx">refresh_delegate_tx</option>
        </select>

        <br />

        <label htmlFor="signed_payload">Signed Transaction Payload</label>
        <input type="text" id="signed_payload" name="signed_payload" value={signedTx} onChange={e => setSignedTx(e.target.value)} />

        <button disabled={!signedTx || !!flowState} type="submit">Broadcast Transaction</button>
      </form> 

      <p> Transaction State </p>

      <br />

      {flowState ? (
        <>
          <div className="payload">{flowState}</div>
          <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
        </>
      ) : <></>}

      <Link rel="noopener noreferrer" target="_blank" href="/tutorial/4_broadcasting">View the tutorial</Link>

      <Link href="/">Return to Main Page</Link>


    </div>
  </>);
}
