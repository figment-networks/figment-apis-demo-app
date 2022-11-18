import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()

  const [flowState, setFlowState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flowId, setFlowId] = useState("")
  useEffect(() => {
    setFlowId(localStorage.getItem('DEMO_STAKING_FLOW') as string)
  }, [])

  const handleNextPage = async () => {
    router.push("/")
  }

  const handleGetStatus = async () => {

        // Pass the flow ID to get its status.
        const data = {
            flow_id: flowId,
        }
      
        setIsLoading(true)
        const response = await fetch("/api/near-delegate/get-flow-state", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();
        setIsLoading(false)
          setFlowState(result.state)
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
    }
    setIsLoading(true)
    const response = await fetch("/api/near-delegate/get-flow-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("Result: ", result)
    setFlowState(result.state)
    setIsLoading(false)
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Get Flow Status</h1>

      <p className={styles.description}>
      After broadcasting the signed transaction, you can check on the state of the flow with a GET request.
      </p>
      <br /><br />
      <p>Current Flow ID: <b>{flowId}</b></p>

      <form onSubmit={handleSubmit} method="post">
        
        <button type="button" onClick={handleGetStatus}>Get the current state of the transaction 🔄</button>
      </form>

      <p> Transaction State </p>

      <br /> 
            {isLoading ? "Loading..." : ""}

            {flowState
              ? <div className="payload">{flowState}</div>
              : ""
            }
            
            {flowState
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Go Home</button>
              : ""
            }

    </div>
  );
}
