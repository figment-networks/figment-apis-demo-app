import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import Profile from "../components/Profile";
import { useAppState } from "../components/AppState";

export default function CreateNEARAccountPage() {
  const router = useRouter()
  const { appState, setAppState } = useAppState()
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPage = async () => {
    router.push("/near-delegate/create-new-flow");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/near-create-account", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { secret, pubkey, account } = await response.json();
    setAppState({
      ...appState,
      secret,
      pubkey,
      account,
    })

    setTimeout(() => console.log(appState))

    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Create a NEAR .testnet account</h1>

        <p className={styles.description}>
          {!appState.account ? (
            `Click the Create Account button to generate a random keypair and testnet account name, 
            which is only intended for use with this demo of Figment's Staking API.`
          ) : ""
          }
        </p>
          <form onSubmit={handleSubmit} method="post">
            {appState.account ? (
              <b>Your testnet address for this demo is {appState.account}</b>
            ) : (
              <button type="submit" disabled={isLoading ? true : false}>
                Create Account
              </button>
            )}
          </form>
          <p className={styles.description}>
          The keypair will be saved, unencrypted, in your browser localStorage
          with the key{" "}
          <code>near-api-js:keystore:[account_id.testnet]:testnet</code>.
          </p>
          <br /> <br />
     

        {isLoading ? "Loading..." : ""}

        {appState.pubkey ? (<>
          <Profile
            accountPubKey={appState.pubkey}
            accountSecret={appState.secret}
            accountAddress={appState.account}
          />
          <button className="nextPage" type="button" onClick={handleNextPage}>
            Stake NEAR on testnet
          </button>

          <p className={styles.description}>
            If you want to view (or remove) the keypair &rarr; Press{" "}
            <code>F12</code> <i>or</i> <b>⌥ Option + ⌘ Command + I</b> on macOS,{" "}
            <b>Ctrl + Shift + I</b> on Windows/Linux to open your browser tools.
            Navigate to the Storage tab and filter using part of the known key.
          </p>

          <Image
            src="/img/localstorage_keyring.png"
            alt="localstorage"
            width={900}
            height={170}
            className="inline_image"
          />
          </>) : null}
        <br />
        <br />
        <Link href="/">Return to Main Page</Link>
        <br />
      </div>
    </>
  );
}
