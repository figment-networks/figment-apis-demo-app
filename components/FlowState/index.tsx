import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from "next/router";
import { useAppState } from "../AppState";

export default function PageWithJSbasedForm({
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
  const [flowState, setFlowState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPage = async () => {
    router.push("/");
  };

  const handleGetState = async () => {
    // Pass the flow ID to get its state.
    const data = {
      flow_id: appState.flowId,
    };

    setIsLoading(true);
    const response = await fetch(`/api/${route}/get-flow-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setIsLoading(false);
    setFlowState(result.state);
  };

  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const data = {
      flow_id: appState.flowId,
    };
    setIsLoading(true);
    const response = await fetch(`/api/${route}/get-flow-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Result: ", result);
    setFlowState(result.state);
    setIsLoading(false);
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Get {description} Flow State</h1>

      <p className={styles.description}>
        After broadcasting the signed transaction, you can check on the state of
        the flow with a GET request.
      </p>
      <br />
      <br />
      <p>
        Current Flow ID: <b>{appState.flowId}</b>
      </p>

      <form onSubmit={handleSubmit} method="post">
        <button
          type="button"
          disabled={flowState === "delegated"}
          onClick={handleGetState}
        >
          Get the current state of the transaction 🔄
        </button>
      </form>
      <p> Transaction State </p>
      <br />
      {isLoading ? "Loading..." : ""}
      {flowState ? (
        <>
          <div className="payload">{flowState}</div>
          {flowState === "delegated" ? (
            <>
              <Link
                target="_blank"
                style={{ marginTop: "20px" }}
                href={`https://explorer.testnet.near.org/accounts/${appState.account}`}
              >
                View Transactions on Near Explorer
              </Link>
              <button
                className="nextPage"
                type="button"
                onClick={handleNextPage}
              >
                Go Home
              </button>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
