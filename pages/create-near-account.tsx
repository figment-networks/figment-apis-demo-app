import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import router, { useRouter } from "next/router";
import Image from "next/image";

import { keyStores, ConnectConfig, KeyPair, connect } from "near-api-js";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";

import Profile from "../components/Profile";

function keyLocalStorage(secret: string, pubkey: string, address: string) {
  const myKeyStore = new BrowserLocalStorageKeyStore();
  const keyPair = KeyPair.fromString(secret);

  // setKey will store the keypair in localstorage
  // as near-api-js:keystore:[account_id.testnet]:testnet
  myKeyStore.setKey("testnet", address, keyPair);

  // Setting individual items is easier to deal with
  // for demo purposes
  localStorage.setItem("DEMO_NEAR_SECRET", secret)
  localStorage.setItem("DEMO_NEAR_PUBKEY", pubkey)
  localStorage.setItem("DEMO_NEAR_ADDRESS", address)

  const regex = /near-api-js:keystore:/;

  console.log(myKeyStore);
  const keys = Object.keys(localStorage).flatMap((k) => {
    if (regex.test(k) === true) {
      console.log(k);
      return k;
    }
  });
  console.log(keys);
}

export default function CreateNEARAccountPage() {
  const [accountSecret, setAccountSecret] = useState("");
  const [accountPubKey, setAccountPubKey] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPage = async () => {
    router.push("/near-delegate/create-new-flow");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // const form = event.target as HTMLFormElement;
    // const data = {
    //   account_name: form.account_name.value as string
    // }

    setIsLoading(true);
    const response = await fetch("/api/near-create-account", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const {secret, pubkey, account} = await response.json();
    setAccountSecret(secret);
    setAccountPubKey(pubkey);
    setAccountAddress(account);
    setIsLoading(false);
    keyLocalStorage(secret, pubkey, account);
  };

  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Create a NEAR .testnet account</h1>

        <p className={styles.description}>
          {!accountAddress ? (
            `Click the Create Account button to generate a random keypair and testnet account name, 
            which is only intended for use with this demo of Figment's Staking API.`
          ) : ""
          }
        </p>
          <form onSubmit={handleSubmit} method="post">
            {accountAddress ? (
              <b>Your testnet address for this demo is {accountAddress}</b>
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

        {accountPubKey ? (<>
          <Profile
            accountPubKey={accountPubKey}
            accountSecret={accountSecret}
            accountAddress={accountAddress}
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
