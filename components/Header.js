import Image from "next/image";
import css from "styled-jsx/css";
import { useState } from "react";

export default function Header({ accountId, loaded, onLogout, onCreate }) {
  const [waiting, setWaiting] = useState(false);

  return (
    <header>
      <style jsx>{styles}</style>
      <a className="brand" href="https://docs.figment.io" target="_blank">
        <Image src="/figment.svg" alt="Figment Logo" width={24} height={24} />
        <h2>Figment - NEAR Staking</h2>
      </a>
      {!loaded && <></>}
      {loaded && accountId && (
        <button disabled={waiting || !loaded} onClick={onLogout}>
          Logout
        </button>
      )}
      {loaded && !accountId && (
        <button
          disabled={waiting || !loaded}
          onClick={async () => {
            setWaiting(true);
            await onCreate();
            setWaiting(false);
          }}
        >
          New Account
        </button>
      )}
    </header>
  );
}

const styles = css`
  header {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .brand {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .brand h2 {
    display: inline-block;
    font-size: 18px;
    margin-left: 12px;
  }
  .brand:hover {
    color: #034d76;
  }
`;
