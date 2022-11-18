import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

// import useLocalStorage from "../hooks/useLocalStorage"

import { keyStores, ConnectConfig, KeyPair, connect } from "near-api-js";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";

import Profile from "../components/Profile";

export default function IndexPage() {
  const [ pubkey, setPubKey ] = useState("")
  const [ address, setAddress ] = useState("")

  useEffect(() => {
    setPubKey(localStorage.getItem("DEMO_NEAR_PUBKEY") as string)
    setAddress(localStorage.getItem("DEMO_NEAR_ADDRESS") as string)

    const myKeyStore = new BrowserLocalStorageKeyStore();
    const keyStoreKeys = myKeyStore.getAccounts("testnet");
    console.log(keyStoreKeys);
  }, [])
  
  return (<>
      <Head>
        <title>Figment Demo App</title>
        <meta
          name="description"
          content="Institutional Staking Made Easy with Figment"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Stake with <a href="https://figment.io">Figment</a>
        </h1>

        <p className={styles.intro}>Institutional Staking Made Easy!</p>

        <div className={styles.grid}>

          {address
          ? (<Profile
            accountAddress={address}
            accountPubKey={false}
            accountSecret={false}
          />)
          : (<Link href="/create-near-account" className={styles.card}>
          <h2>NEAR Account &rarr;</h2>
          <p>Create a Testnet NEAR Account to Demo the Staking API</p>
        </Link>)
          }
          

          <Link href="/near-delegate/create-new-flow" className={styles.card}>
            <h2>Stake NEAR &rarr;</h2>
            <p>Explore Figment's Staking API in Real Time</p>
          </Link>

          <Link href="/near-undelegate/create-new-flow" className={styles.card}>
            <h2>Unstake NEAR &rarr;</h2>
            <p>Explore Figment's Staking API in Real Time</p>
          </Link>

          <Link href="/near-transfer/create-new-flow" className={styles.card}>
            <h2>Transfer NEAR &rarr;</h2>
            <p>Explore Figment's Staking API in Real Time</p>
          </Link>

          <Link href="/transaction-search" className={styles.card}>
            <h2>Search Transaction &rarr;</h2>
            <p>Search Transaction Using Figment's Node API in Real Time</p>
          </Link>

          <Link href="/tutorial/0_structure" className={styles.card}>
            <h2>Integration Tutorial &rarr;</h2>
            <p>Learn how to integrate Figment's Staking API with your product</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://docs.figment.io/" target="_blank" rel="noopener noreferrer">
         Figment Docs
        </a>
        <a href="https://figment.io" target="_blank" rel="noopener noreferrer">
          Figment{" "}
          <span className={styles.logo}>
            <Image src="/f.svg" alt="Figment Logo" width={16} height={16} />
          </span>
        </a>
      </footer>
    </div>
    </>);
}
