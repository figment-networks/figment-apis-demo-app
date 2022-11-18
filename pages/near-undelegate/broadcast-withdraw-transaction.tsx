import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [transactionPayload, setTransactionPayload] = useState();
  const [flowState, setFlowState] = useState();

  let showMeTheFlow

  const handleNextPage = async () => {
    router.push("/near-undelegate/get-withdrawal-flow-status")
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Grab Flow ID from localStorage
    localStorage.getItem('FLOW')

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    console.log(form)
    // Get data from the form.
    // const data = {
    //   first: form.network_code.value as string,
    //   last: form.chain_code.value as string,
    // };

    const data = {
      flow_id: localStorage.getItem('FLOW') as string,
      action: form.flowAction.value as string,
      signed_payload: form.signed_payload.value as string,
    }

    showMeTheFlow = localStorage.getItem('FLOW')

    // Send the form data to our API and get a response.
    const response = await fetch("/api/near-undelegate/broadcast-withdrawal-transaction", {
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
    console.log("transaction state: ", result.state)
    localStorage.setItem('FLOWSTATE', result.state)
    // @ts-ignore
    setTransactionPayload(localStorage.getItem('SIGNED_PAYLOAD'))
    setFlowState(localStorage.getItem('FLOWSTATE'))
  };
  return (<>
    <div className="container">
      <h1 className={styles.title}>Submit Signed Withdraw Txn for Broadcast</h1>

      <p className={styles.description}>
      After signing the transaction, provide the signed transaction_payload below. The Staking API will broadcast the transaction to the NEAR network.

        {showMeTheFlow}
      </p>

      <form onSubmit={handleSubmit} method="post">
        
        <label htmlFor="action">Action:</label>
        <select id="action" name="flowAction" required defaultValue="sign_withdraw_tx">
          <option value="sign_withdraw_tx">sign_withdraw_tx</option>
          <option value="refresh_withdraw_tx">refresh_withdraw_tx</option>
        </select>

        <br/>

        <label htmlFor="inputs">Inputs:</label>
        <label htmlFor="signed_payload">Signed Transaction Payload</label>
        <input type="text" id="signed_payload" name="signed_payload" defaultValue={transactionPayload} />

        <button type="submit">Broadcast Transaction</button>
      </form>

      <p> Transaction State </p>

      <br /> 

            {transactionPayload
              ? <div className="payload">{flowState}</div>
              : ""
            } 

            {transactionPayload
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
              : ""
            } 


    </div>
    </>);
}
