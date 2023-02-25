import 'reflect-metadata'

import '@picocss/pico'
import 'styles/global.css'

import { Header } from 'components/header/Header'
import AppStore from 'components/store'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'


export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <meta name="description" content="Description" />
                <meta name="keywords" content="Keywords" />
                <title>Next.js PWA Example</title>

                <link rel="manifest" href="/manifest.json" />
                <link
                    href="/icons/favicon-16x16.png"
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                />
                <link
                    href="/icons/favicon-32x32.png"
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                />
                <link rel="apple-touch-icon" href="/apple-icon.png" />
                <meta name="theme-color" content="#317EFB" />
            </Head>
            <SessionProvider session={session}>
                <AppStore>
                    <Header />
                    <div className="container">
                        <Component {...pageProps} />
                    </div>
                </AppStore>
            </SessionProvider>
        </>
    )
}
