import Link from "next/link";

export const explorerUrl = (address: string) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

export default function Profile(props: any) {
  return (
    <>
      {props.accountAddress ? (<>
        <div className="profile">
          <h3 className="address"><Link href="/create-near-account">Account Address</Link> &rarr;</h3> 
            <Link className="ext_link" href={explorerUrl(props.accountAddress)}>
              {props.accountAddress}
            </Link>

      {props.accountPubKey ? (<>
          <h3 className="pubkey">Account Public Key &rarr;</h3>
          <p>{props.accountPubKey}</p></>) : ""}

          {props.accountSecret ? (<>
            <h3 className="pubkey">
              Account Private Key (hover to reveal, click to copy)
              &rarr;
            </h3>
             <p className="secret" onClick={() => navigator.clipboard.writeText(props.accountSecret)}>{props.accountSecret}</p>
             </>) : null}
        </div>
      </>) : null}
    </>
  );
}
