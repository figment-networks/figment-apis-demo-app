import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [signedTransactionPayload, setSignedTransactionPayload] = useState("");
  const [flowState, setFlowState] = useState("");
  const [accountPubKey, setAccountPubKey] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [flowId, setFlowId] = useState("")

  // Get the Public Key, Address and Current Flow ID from localStorage
  useEffect(() => {
    setAccountPubKey(localStorage.getItem('DEMO_NEAR_PUBKEY') as string)
    setAccountAddress(localStorage.getItem('DEMO_NEAR_ADDRESS') as string)
    setFlowId(localStorage.getItem('DEMO_UNSTAKING_FLOW') as string)
    console.log("flowID: ", flowId)
  }, [])

  const handleNextPage = async () => {
    router.push("/near-undelegate/get-flow-state")
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    console.log(form)
    // Get data from the form.
    // const data = {
    //   first: form.network_code.value as string,
    //   last: form.chain_code.value as string,
    // };

    const data = {
      flow_id: flowId,
      action: form.flowAction.value as string,
      signed_payload: form.signed_payload.value as string,
    }

    const response = await fetch("/api/near-undelegate/broadcast-transaction", {
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
      localStorage.setItem('FLOWSTATE', result.state)
      // @ts-ignore
      setSignedTransactionPayload(localStorage.getItem('SIGNED_UNDELEGATE_PAYLOAD') as string)
      setFlowState(localStorage.getItem('FLOWSTATE') as string)  
    }


  };
  return (<>
    <div className="container">
      <h1 className={styles.title}>Submit Signed Delegate Txn for Broadcast</h1>

      <p className={styles.description}>
      After signing the transaction, provide the signed transaction_payload below. The Staking API will broadcast the transaction to the NEAR network.
      </p>
      <p>Current Flow ID: <b>{flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="sign_undelegate_tx">
          <option value="sign_undelegate_tx">sign_undelegate_tx</option>
          <option value="refresh_undelegate_tx">refresh_undelegate_tx</option>
        </select>

        <br/>

        <label htmlFor="signed_payload">Signed Transaction Payload</label>
        <input type="text" id="signed_payload" name="signed_payload" defaultValue={signedTransactionPayload} />

        <button type="submit">Broadcast Transaction</button>
      </form>

      <p> Transaction State </p>

      <br /> 

            {signedTransactionPayload
              ? <div className="payload">{flowState}</div>
              : ""
            } 

            {signedTransactionPayload
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
              : ""
            } 


    </div>
    </>);
}
