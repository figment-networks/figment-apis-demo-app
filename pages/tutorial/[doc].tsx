import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs';

import Profile from '../../components/Profile'

const components = { Profile, Link, Image }

export default function TutorialPage({ mdxSource }: { mdxSource: any}) {
    return (<>
        <div className="tutorial-container">
            <h1 className="tutorial-title">{mdxSource.frontmatter.title}</h1>
            <MDXRemote {...mdxSource} components={components} />
            <div className="tutorialFooter">
            {mdxSource.frontmatter.prev_page
                ? (<><a className="prevPageLink" href={"/tutorial/" + mdxSource.frontmatter.prev_page}>Previous Page</a></>)
                : null
            }
            {!mdxSource.frontmatter.prev_page ? " " : " — "}
            {mdxSource.frontmatter.next_page
                ? (<><a className="homePageLink" href="/">Go Home</a> &mdash; <a className="nextPageLink" href={"/tutorial/" + mdxSource.frontmatter.next_page}>Next Page</a></>)
                : null
            }
           </div>
        </div>
    </>)
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: { doc: '1_integration' } },
            { params: { doc: '2_submit-data' } },
            { params: { doc: '3_payload-signing' } },
            { params: { doc: '4_broadcasting' } },
            { params: { doc: '5_wrapping-up' } },
            { params: { doc: '6_recap' } },
        ],
        fallback: false,
    }
}

export async function getStaticProps(ctx: any) {
    const doc = ctx.params.doc
    const source = fs.readFileSync(`tutorial/${doc}.mdx`)
    const mdxSource = await serialize(source, { parseFrontmatter: true })
    return { props: { mdxSource } }
}