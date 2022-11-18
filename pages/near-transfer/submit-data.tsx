import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [transactionPayload, setTransactionPayload] = useState()
  const [accountPubKey, setAccountPubKey] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [flowId, setFlowId] = useState("")


useEffect(() => {
  setAccountPubKey(localStorage.getItem('DEMO_NEAR_PUBKEY') as string)
  setAccountAddress(localStorage.getItem('DEMO_NEAR_ADDRESS') as string)
      setFlowId(localStorage.getItem('DEMO_TRANSFER_FLOW') as string)
    console.log("flowID: ", flowId)
}, [])

  let showMeTheFlow;

  const handleNextPage = async () => {
    router.push("/near-transfer/sign-payload")
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Grab Flow ID from localStorage.
    showMeTheFlow = localStorage.getItem('DEMO_TRANSFER_FLOW')

    // Cast the event target to an HTML form.
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      flow_id: localStorage.getItem('DEMO_TRANSFER_FLOW') as string,
      action: form.flowAction.value as string,
      from_account_pubkey: form.from_account_pubkey.value as string,
      from_account_address: form.from_account_address.value as string,
      to_account_address: form.to_account_address.value as string,
      amount: form.amount.value as number
    }

    showMeTheFlow = localStorage.getItem('DEMO_TRANSFER_FLOW')

    // Send the form data to our API and get a response.
    const response = await fetch("/api/near-transfer/near-submit-transfer-data", {
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // The method is POST because we are sending data.
      method: "POST",
    });

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    if (result.code === 'transition_error') {
      alert("Transition error! Passed action cannot be executed on the flow in its current state.")
    }

    if (result.data) {
      console.log("---------->> RESULT:", result)
      console.log("raw payload: ", result.data.transfer_transaction.raw)
      localStorage.setItem('PAYLOAD', result.data.transfer_transaction.raw)
      // @ts-ignore
      setTransactionPayload(localStorage.getItem('PAYLOAD'))
    }
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Submit Data to Transfer NEAR</h1>

      <p className={styles.description}>
        At this step, we'll submit the Transfer data which includes Sender Pubkey, Sender Address, Recipient Address and Amount to Transfer

        {showMeTheFlow}
      </p>

      <p> Current Flow ID: <b>{flowId}</b> </p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="create_transfer_tx">
          <option value="create_transfer_tx">create_transfer_tx</option>
        </select>

        <label htmlFor="from_account_pubkey">Sender Pubkey (ECDSA prefix <code><b>ed25519:</b></code>)</label>
        <input type="text" id="from_account_pubkey" name="from_account_pubkey" defaultValue={accountPubKey} />

        <label htmlFor="from_account_address">Sender Address (including <b>.testnet</b>)</label>
        <input type="text" id="from_account_address" name="from_account_address" defaultValue={accountAddress} />

        <label htmlFor="to_account_address">Recipient Address</label>
        <input type="text" id="to_account_address" name="to_account_address" />

        <label htmlFor="amount">Amount</label>
        <input type="text" id="amount" name="amount" defaultValue="10.0" />

        <button type="submit">Submit Transfer Data</button>
      </form>

      <p> Transaction Payload to Sign (click to copy) </p>

      <br /> 
            {transactionPayload
              ? (<><div className="payload" onClick={() => navigator.clipboard.writeText(transactionPayload)}>{transactionPayload}</div> <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button></>)
              : ""
            } 
    </div>
  );
}
