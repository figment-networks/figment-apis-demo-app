import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from "next/router";
import { useAppState } from "../AppState";

export default function SignPayload({
  route,
  operation,
  description,
}: {
  route: string;
  operation: string;
  description: string;
}) {
  const router = useRouter();
  // @ts-ignore
  const { appState, setAppState } = useAppState();
  const [txToSign, setTxToSign] = useState("");

  const [copied, setCopied] = useState(false);
  function copyText(text: any) {
    navigator.clipboard.writeText(text);
    setCopied(text);
  }

  const handleNextPage = async () => {
    router.push(`/${route}/broadcast-transaction`);
  };

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    const data = {
      flow_id: appState.flowId as string,
      transaction_payload: form.transaction_payload.value as string,
      privateKey: appState.secret as string,
    };

    // Send the form data to our API and get a response.
    const response = await fetch(`/api/${route}/near-sign-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    // Get the response data from server as JSON.
    const result = await response.json();

    console.log("Signed payload: ", result);
    setAppState({
      ...appState,
      payload: {
        ...appState.payload,
        signed: result,
      },
    });
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Sign the Transaction Payload</h1>

      <p className={styles.description}>
        After submitting the delegation data, provide the unsigned{" "}
        <code>transaction_payload</code> below.
        <br />
        <br />
        The Staking API will broadcast the {description} transaction to the NEAR network.
      </p>

      <p>
        {" "}
        Current Flow ID: <b>{appState.flowId}</b>{" "}
      </p>

      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="transaction_payload">
          Unsigned Transaction Payload (Provide the Transaction Payload)
        </label>
        <input
          type="text"
          id="transaction_payload"
          name="transaction_payload"
          value={txToSign}
          onChange={(e) => setTxToSign(e.target.value)}
        />
        <button disabled={!txToSign || appState.payload.signed} type="submit">
          Sign Transaction Payload
        </button>
      </form>

      <p> Signed Transaction Payload (click to copy) </p>
      <br />
      {appState.payload.signed ? (
        <>
          <div className="payload">{appState.payload.signed}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            <button
              className="prevPage"
              type="button"
              disabled={copied}
              onClick={() => copyText(appState.payload.signed)}
              style={{ marginRight: "12px" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              className="nextPage"
              type="button"
              disabled={!copied}
              onClick={handleNextPage}
              style={{ flexShrink: 0, margin: 0 }}
            >
              Next Step
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
