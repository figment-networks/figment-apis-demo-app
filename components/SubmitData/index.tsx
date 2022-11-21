import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from "next/router";
import { useAppState } from "../AppState";

export default function SubmitDelegateDataPage({
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

  const [copied, setCopied] = useState(false);
  function copyText(text: any) {
    navigator.clipboard.writeText(text);
    setCopied(text);
  }

  const handleNextPage = async () => {
    router.push(`/${route}/sign-payload`);
  };

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      flow_id: appState.flowId as string,
      action: form.flowAction.value as string,
      delegator_address: form.delegator_address.value as string,
      delegator_pubkey: form.delegator_pubkey.value as string,
      validator_address: form.validator_address.value as string,
      amount: form.amount.value as number,
      max_gas: form.max_gas.value as string,
    };

    const response = await fetch(`/api/${route}/near-submit-delegate-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // If the result has an error code, alert the user with the error
    if (result.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (result.data) {
      console.log("Result: ", result);
      console.log("Raw payload: ", result.data.delegate_transaction.raw);
      setAppState({
        ...appState,
        payload: {
          ...appState.payload,
          raw: result.data.delegate_transaction.raw,
        },
      });
    }
  };
  return (
    <div className="container">
      <h1 className={styles.title}>
        Submit {description} Data to the Staking API
      </h1>

      <p className={styles.description}>
        In this step, we'll submit the delegation data which includes the{" "}
        <b>Delegator Address</b>, <b>Delegator Pubkey</b>,{" "}
        <b>Validator Address</b> and <b>Amount</b> of NEAR to delegate.
        <br />
        <br />
        Current Flow ID: <b>{appState.flowId}</b>
      </p>

      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="action">Action:</label>
        <select
          id="action"
          name="flowAction"
          required
          defaultValue="create_delegate_tx"
        >
          <option value="create_delegate_tx">create_delegate_tx</option>
        </select>

        <label htmlFor="delegator_address">
          Delegator Address (including <b>.testnet</b>)
        </label>
        <input
          type="text"
          id="delegator_address"
          name="delegator_address"
          defaultValue={appState.account}
        />

        <label htmlFor="delegator_pubkey">
          Delegator Public Key (ECDSA prefix{" "}
          <code>
            <b>ed25519:</b>
          </code>
          )
        </label>
        <input
          type="text"
          id="delegator_pubkey"
          name="delegator_pubkey"
          defaultValue={appState.pubkey}
        />

        <label htmlFor="validator_address">
          Validator Address (select a NEAR testnet validator)
        </label>
        <select
          id="validator_address"
          name="validator_address"
          required
          defaultValue="v1"
        >
          <option value="01node.pool.f863973.m0">01node.pool.f863973.m0</option>
          <option value="aurora.pool.f863973.m0">aurora.pool.f863973.m0</option>
        </select>

        <label htmlFor="amount">Amount</label>
        <input type="text" id="amount" name="amount" defaultValue="10.0" />

        <label htmlFor="max_gas">Max Gas (optional)</label>
        <input type="text" id="max_gas" name="max_gas" defaultValue="" />

        <button disabled={!!appState.payload.raw} type="submit">
          Submit Delegation Data
        </button>
      </form>

      <p> Transaction Payload to Sign (click to copy) </p>
      <br />

      {appState.payload.raw ? (
        <>
          <div className="payload">{appState.payload.raw}</div>
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
              onClick={() => copyText(appState.payload.raw)}
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
      <Link href="/">Return to Main Page</Link>
    </div>
  );
}
