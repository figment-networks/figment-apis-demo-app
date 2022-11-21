import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "/styles/Home.module.css";
import { useRouter } from 'next/router'

export default function PageWithJSbasedForm() {
  const router = useRouter()
  let showMeTheFlow;
  let flow_status;
  let estimated_change;

  const [flowStatus, setFlowStatus] = useState("");
  const [estimatedChange, setEstimatedChange] = useState ("");
  const [isLoading, setIsLoading] = useState(false);


  const handleNextPage = async () => {
    router.push("/near-undelegate/submit-withdrawal-data")
  }

  const handleGetStatus = async () => {

        // Pass the flow ID to get its status.
        const data = {
            flow_id: localStorage.getItem('FLOW') as string,
        }
      
        setIsLoading(true)
        // Send the form data to our API and get a response.
        const response = await fetch("/api/near-undelegate/get-flow-status", {
            // Body of the request is the JSON data we created above.
            body: JSON.stringify(data),
            // Tell the server we're sending JSON.
            headers: {
              "Content-Type": "application/json",
            },
            // The method is POST because we are sending data.
            method: "POST",
          });

          const result = await response.json();

          console.log(result.id)

        flow_status = localStorage.setItem('DEMO_FLOW_STATUS', result.state)
        // @ts-ignore
        setFlowStatus(localStorage.getItem('DEMO_FLOW_STATUS'))

        estimated_change = localStorage.setItem('DEMO_ESTIMATED_CHANGE', result.data.estimated_inactive_at)
        // @ts-ignore
        setEstimatedChange(localStorage.getItem('DEMO_ESTIMATED_CHANGE'))

  }


  const handleSubmit = async (event: FormEvent) => {
    // Handle the submit event on form submit.
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Grab Flow ID & Payload from localStorage
    localStorage.getItem('FLOW');
    localStorage.getItem('PAYLOAD');

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;
    
    // Get data from the form.
    const data = {
      flow_id: localStorage.getItem('FLOW') as string,
    }

    showMeTheFlow = localStorage.getItem('FLOW')

    // Send the form data to our API and get a response.
    const response = await fetch("/api/near-undelegate/get-flow-status", {
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
    console.log("Flow status: ", result.state)
    flow_status = localStorage.setItem('DEMO_FLOW_STATUS', result.state)
    // @ts-ignore
    setFlowStatus(localStorage.getItem('DEMO_FLOW_STATUS'))

    console.log("Estimated state change at: ", result.data.estimated_inactive_at)
    estimated_change = localStorage.setItem('DEMO_ESTIMATED_CHANGE', result.data.estimated_inactive_at)
    // @ts-ignore
    setEstimatedChange(localStorage.getItem('DEMO_ESTIMATED_CHANGE'))
  };
  return (
    <div className="container">
      <h1 className={styles.title}>Get Flow Status</h1>

      <p className={styles.description}>
      After broadcasting the signed transaction, you can check on the state of the flow with a GET request.
        {showMeTheFlow}
      </p>

      <form onSubmit={handleSubmit} method="post">
      
        <button type="button" onClick={handleGetStatus}>Get the latest status of the transaction 🔄</button>
      </form>

      <p> Transaction State </p>
      <br /> 

            {flowStatus
              ? <div className="payload">{flowStatus}</div>
              : ""
            }

      <br />
      <p> Estimated Time for State Change </p>
      <br />

            {estimatedChange
              ? <div className="payload">{estimatedChange}</div>
              : ""
            }
            
            {flowStatus
              ? <button className="nextPage" type="button" onClick={handleNextPage}>Next Step</button>
              : ""
            }

    </div>
  );
}
