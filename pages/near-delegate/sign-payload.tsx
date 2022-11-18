import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [signedTransactionPayload, setSignedTransactionPayload] = useState()
  const [transactionPayload, setTransactionPayload] = useState()
  const [flowId, setFlowId] = useState()

  let payload
  let signed_payload
  let privKey

  const handleNextPage = async () => {
    router.push("/near-delegate/broadcast-transaction")
  }

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Grab Flow ID & Payload from localStorage
    payload = localStorage.getItem('PAYLOAD');
    privKey = localStorage.getItem('DEMO_NEAR_SECRET')
      // @ts-ignore
  setFlowId(localStorage.getItem('FLOW'))


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
      // action: form.flowAction.value as string,
      transaction_payload: form.transaction_payload.value as string,
      privateKey: privKey as string
    }

    // Send the form data to our API and get a response.
    const response = await fetch("/api/near-delegate/near-sign-payload", {
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
    console.log("signed payload: ", result)
    localStorage.setItem('SIGNED_PAYLOAD', result)
    signed_payload = localStorage.getItem('SIGNED_PAYLOAD')
    // @ts-ignore
    setTransactionPayload(payload)
    // @ts-ignore
    setSignedTransactionPayload(signed_payload)
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Sign the Transaction Payload</h1>

      <p className={styles.description}>
      After submitting the delegation data, provide the unsigned <code>transaction_payload</code> below.<br /><br />
      The Staking API will broadcast the transaction to the NEAR network.
      </p>

      <p> Current Flow ID: <b>{flowId}</b> </p>

      <form onSubmit={handleSubmit} method="post">

        <label htmlFor="transaction_payload">Unsigned Transaction Payload (Provide the Transaction Payload)</label>
        <input type="text" id="transaction_payload" name="transaction_payload" defaultValue={transactionPayload} />

        <button type="submit">Sign Transaction Payload</button>
      </form>

      <p> Signed Transaction Payload (click to copy) </p>
      <br /> 

            {signedTransactionPayload
              ? <div className="payload" onClick={() => navigator.clipboard.writeText(signedTransactionPayload)}>{signedTransactionPayload}</div>
              : ""
            }

            {signedTransactionPayload
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
              : ""
            } 


    </div>
  );
}
