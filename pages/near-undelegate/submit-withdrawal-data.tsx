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

  // Get the Public Key, Address and Current Flow ID from localStorage
  useEffect(() => {
    setAccountPubKey(localStorage.getItem('DEMO_NEAR_PUBKEY') as string)
    setAccountAddress(localStorage.getItem('DEMO_NEAR_ADDRESS') as string)
    setFlowId(localStorage.getItem('DEMO_WITHDRAWAL_FLOW') as string)
    console.log("flowID: ", flowId)
  }, [])

  const handleNextPage = async () => {
    router.push("/near-undelegate/sign-withdrawal-payload")
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
      withdraw_amount: form.withdraw_amount.value as number,
      withdraw_maximum: form.withdraw_maximum.value as boolean
    }

    const response = await fetch("/api/near-undelegate/submit-withdrawal-data", {
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
      console.log("raw payload: ", result.data.withdraw_transaction.raw)
      localStorage.setItem('PAYLOAD', result.data.withdraw_transaction.raw)
      // @ts-ignore
      setTransactionPayload(localStorage.getItem('PAYLOAD'))
    }
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Submit Withdrawal Data to Withdraw NEAR</h1>

      <p className={styles.description}>
        In this step, we'll submit the withdrawal data which includes <b>Delegator Address</b>, <b>Delegator Pubkey</b>, <b>Validator Address</b> and <b>Amount</b> of NEAR to withdraw.
      </p>
      <p>Note that this step can only be completed once an undelegated amount has become available for withdrawal, after the epoch boundary.</p>
      <p>Current Flow ID: <b>{flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="create_withdraw_tx">
          <option value="create_withdraw_tx">create_withdraw_tx</option>
        </select>

        <label htmlFor="delegator_address">Delegator Address (including <b>.testnet</b>)</label>
        <input type="text" id="delegator_address" name="delegator_address" required defaultValue={accountAddress} />

        <label htmlFor="delegator_pubkey">Delegator Public Key (ECDSA prefix <code><b>ed25519:</b></code>)</label>
        <input type="text" id="delegator_pubkey" name="delegator_pubkey" required defaultValue={accountPubKey} />

        <label htmlFor="validator_address">Validator Address (select a NEAR testnet validator)</label>
        <select id="validator_address" name="validator_address" required>
          <option value="01node.pool.f863973.m0">01node.pool.f863973.m0</option>
          <option value="aurora.pool.f863973.m0">aurora.pool.f863973.m0</option>
        </select>

        <label htmlFor="withdraw_amount">Withdraw Amount</label>
        <input type="text" id="withdraw_amount" name="withdraw_amount" required defaultValue="5.0" />

        <label htmlFor="withdraw_maximum">Withdraw Maximum (Optional)</label>
        <select id="withdraw_maximum" name="withdraw_maximum" defaultValue="true">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>

        <label htmlFor="max_gas">Max Gas (Optional)</label>
        <input type="text" id="max_gas" name="max_gas"/>

        <button type="submit">Submit Withdraw Data</button>
      </form>

      <p>Transaction Payload to Sign (click to copy)</p>

      <br /> 
            {transactionPayload
              ? (<><div className="payload" onClick={() => navigator.clipboard.writeText(transactionPayload)}>{transactionPayload}</div> <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button></>)
              : ""
            } 
    </div>
  );
}
