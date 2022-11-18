import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import router, { useRouter } from "next/router";

import Image from "next/image";

import { keyStores, ConnectConfig, KeyPair, connect } from "near-api-js";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";

import Profile from "../components/Profile";

const regex = /near-api-js:keystore:/;

function keyLocalStorage(secret: string, pubkey: string, address: string) {
  console.log(secret);
  const myKeyStore = new BrowserLocalStorageKeyStore();
  const keyPair = KeyPair.fromString(secret);

  // setKey will store the keypair in localstorage
  // as near-api-js:keystore:[account_id.testnet]:testnet
  myKeyStore.setKey("testnet", address, keyPair);

  // Setting individual items is easier to deal with
  // for demo purposes
  localStorage.setItem("DEMO_NEAR_SECRET", secret);
  localStorage.setItem("DEMO_NEAR_PUBKEY", pubkey);
  localStorage.setItem("DEMO_NEAR_ADDRESS", address);

}

export default function TransactionSearchPage() {
  const [accountSecret, setAccountSecret] = useState("");
  const [txInfo, setTxInfo] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!accountAddress) return;
    setAccountAddress(
      window.localStorage.getItem("DEMO_NEAR_ADDRESS") as string
    );
  }, []);

  const handleNextPage = async () => {
    router.push("/");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = {
      account_address: form.account_address.value as string,
      hash: form.hash.value as string
    };

    setIsLoading(true);
    const response = await fetch("/api/transaction-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
      })

    const info = await response.json();
    setTxInfo(info);
    console.log(info);
    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Search Transaction using Node API</h1>

        <form onSubmit={handleSubmit} method="post">
          <label htmlFor="account_address">
            Address (including <b>.testnet</b>)
          </label>
          <input
            type="text"
            id="account_address"
            name="account_address"
            defaultValue={accountAddress}
          />

          <label htmlFor="hash">
          Transaction Hash
        </label>
        <input
          type="text"
          id="hash"
          name="hash"
        />

          <button type="submit">Submit and Search Transaction</button>
        </form>

        <p className={styles.description}>Transaction Info</p>

        {isLoading ? "Loading..." : ""}

        {txInfo ? (
          <>
          
            <pre className="txn-search"><samp>{JSON.stringify(txInfo, null, 2)}</samp></pre>

            <Link className="ext_link" href="/">
              Return to Main Page
            </Link>
          </>
        ) : null}
        <br />
        <br />
      </div>
    </>
  );
}
