import css from "styled-jsx/css";
import { useState } from "react";
import Link from "next/link";

const styles = css`
  section {
    padding: 48px;
    box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: calc(100% - 24px);
    max-width: 600px;
    text-align: center;
  }
  h3 {
    text-align: center;
  }
  input,
  button {
    margin: 12px auto;
    width: 100%;
    max-width: 260px;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function AccountCard({
  loaded,
  accountId,
  publicKey,
  available,
  staked,
  onDelegate,
  delegating,
}) {
  const [amount, setAmount] = useState(1);
  const [waiting, setWaiting] = useState(delegating);

  // Leave this set to true until instructed to change it in Step 7
  const disabled = false;
  // const disabled = waiting || delegating

  return (
    <section>
      <style jsx>{styles}</style>
      {!loaded ? (
        <h3>Checking for local account...</h3>
      ) : accountId ? (
        <>
          <h3>Account ID</h3>
          <p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://explorer.testnet.near.org/accounts/${accountId}`}
            >
              {accountId}
            </Link>
          </p>
          <h3>Public Key</h3>
          <p>{publicKey}</p>
          <h3>Balance</h3>
          {waiting || delegating ? (
            <>
              <div className="spinner-icon"><div></div><div></div><div></div><div></div></div>
              <div>Delegation in progress --- please wait</div>
            </>
          ) : (
            <>
              <p>Available: {available} Ⓝ</p>
              <p>Staked: {staked} Ⓝ</p>
            </>
          )}
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!amount) return;
              const qty = Number.parseFloat(amount);
              setAmount(1);
              setWaiting(true);
              await onDelegate(Number.parseFloat(qty));
              setWaiting(false);
            }}
          >
            <input
              required
              min="1"
              type="number"
              value={amount || 1}
              disabled={waiting || delegating}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit" disabled={disabled}>
              {waiting || delegating ? <div className="spinner-icon"><div></div><div></div><div></div><div></div></div> : <></>}
              {waiting || delegating ? 'IN PROGRESS' : 'STAKE'}
            </button>
          </form>
        </>
      ) : (
        <h3>Create new account to get started</h3>
      )}
    </section>
  );
}
