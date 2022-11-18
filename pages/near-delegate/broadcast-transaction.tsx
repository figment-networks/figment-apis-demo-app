import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [transactionPayload, setTransactionPayload] = useState();
  const [signedTransactionPayload, setSignedTransactionPayload] = useState("")
  const [flowState, setFlowState] = useState();
  const [accountPubKey, setAccountPubKey] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [flowId, setFlowId] = useState("")

  // Get the Public Key, Address and Current Flow ID from localStorage
  useEffect(() => {
    setAccountPubKey(localStorage.getItem('DEMO_NEAR_PUBKEY') as string)
    setAccountAddress(localStorage.getItem('DEMO_NEAR_ADDRESS') as string)
    setFlowId(localStorage.getItem('DEMO_STAKING_FLOW') as string)
    setSignedTransactionPayload(localStorage.getItem('SIGNED_PAYLOAD') as string)  
  }, [])

  const handleNextPage = async () => {
    router.push("/near-delegate/get-flow-state")
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      flow_id: flowId,
      action: form.flowAction.value as string,
      signed_payload: form.signed_payload.value as string,
    }

    const response = await fetch("/api/near-delegate/broadcast-transaction", {
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
      <h1 className={styles.title}>Submit Signed Delegate Transaction for Broadcast</h1>

      <p className={styles.description}>
        After signing the transaction, provide the signed <code>transaction_payload</code>. The Staking API will broadcast the transaction to the NEAR network.
      </p>
      <br /><br />

      <p>Current Flow ID: <b>{flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">

        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="sign_delegate_tx">
          <option value="sign_delegate_tx">sign_delegate_tx</option>
          <option disabled value="refresh_delegate_tx">refresh_delegate_tx</option>
        </select>

        <br />

        <label htmlFor="signed_payload">Signed Transaction Payload</label>
        <input type="text" id="signed_payload" name="signed_payload" defaultValue={signedTransactionPayload} />

        <button type="submit">Broadcast Transaction</button>
      </form>

      <p> Transaction State </p>

      <br />

      {flowState
        ? <div className="payload">{flowState}</div>
        : ""
      }

      {flowState
        ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
        : ""
      }


    </div>
  </>);
}
