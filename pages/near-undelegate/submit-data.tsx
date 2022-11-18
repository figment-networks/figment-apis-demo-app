import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function SubmitUndelegateData() {
  const router = useRouter()

  const [transactionPayload, setTransactionPayload] = useState()
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
    router.push("/near-undelegate/sign-payload")
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
      delegator_address: form.delegator_address.value as string,
      delegator_pubkey: form.delegator_pubkey.value as string,
      validator_address: form.validator_address.value as string,
      undelegate_amount: form.undelegate_amount.value as number
    }

    const response = await fetch("/api/near-undelegate/near-submit-undelegate-data", {
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
      console.log("raw payload: ", result.data.undelegate_transaction.raw)
      localStorage.setItem('PAYLOAD', result.data.undelegate_transaction.raw)
      // @ts-ignore
      setTransactionPayload(localStorage.getItem('PAYLOAD'))  
    }
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Submit Undelegation Data to Unstake NEAR</h1>

      <p className={styles.description}>
        In this step, we'll submit the undelegation data which includes the <b>Delegator Address</b>, <b>Delegator Public Key</b>, <b>Validator Address</b> and <b>Amount</b> of NEAR to undelegate.
      </p>
      <p>Current Flow ID: <b>{flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="create_undelegate_tx">
          <option value="create_undelegate_tx">create_undelegate_tx</option>
          <option value="create_withdraw_tx">create_withdraw_tx</option>
        </select>

        <label htmlFor="delegator_address">Delegator Address (including <b>.testnet</b>)</label>
        <input type="text" id="delegator_address" name="delegator_address" defaultValue={accountAddress} />

        <label htmlFor="delegator_pubkey">Delegator Public Key (ECDSA prefix <code><b>ed25519:</b></code>)</label>
        <input type="text" id="delegator_pubkey" name="delegator_pubkey" defaultValue={accountPubKey} />

        <label htmlFor="validator_address">Validator Address (select a NEAR testnet validator)</label>
        <select id="validator_address" name="validator_address" required defaultValue="v1">
          <option value="01node.pool.f863973.m0">01node.pool.f863973.m0</option>
          <option value="aurora.pool.f863973.m0">aurora.pool.f863973.m0</option>
        </select>

        <label htmlFor="undelegate_amount">Undelegate Amount</label>
        <input type="text" id="undelegate_amount" name="undelegate_amount" defaultValue="5.0" />

        <button type="submit">Submit Undelegation Data</button>
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
