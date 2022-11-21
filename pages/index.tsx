import Link from "next/link";
import styles from "../styles/Home.module.css";
import Head from "../components/Head";
import Profile from "../components/Profile";
import { useAppState } from "../components/AppState";
import Footer from "../components/Footer";

export default function IndexPage() {
  const { appState } = useAppState()
  return (<>
    <Head page="Home" />
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Stake with <a href="https://figment.io" target="_blank">Figment</a>
        </h1>
        <p className={styles.intro}>Institutional Staking Made Easy!</p>
        <div className={styles.grid}>
          {appState.account
            ? (
              <Profile className="card" accountAddress={appState.account} accountPubKey={false} accountSecret={false} />
            ) : (
              <Link href="/create-near-account" className={styles.card}>
                <h2>NEAR Account &rarr;</h2>
                <p>Create a Testnet NEAR Account to Demo the Staking API</p>
              </Link>
            )}
          <Link href="/near-delegate/create-new-flow" className={styles.card}>
            <h2>Stake NEAR &rarr;</h2>
            <p>Explore Figment's Staking API in Real Time</p>
          </Link>

          <Link href="/tutorial/1_integration" className={styles.card}>
            <h2>Integration Tutorial &rarr;</h2>
            <p>Learn how to integrate Figment's Staking API with your product</p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  </>);
}
