import Head from "next/head";

export default function ({ page }) {
    return (
        <Head>
            <title>Figment Demo App - {page}</title>
            <meta name="description" content="Institutional Staking Made Easy with Figment" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}