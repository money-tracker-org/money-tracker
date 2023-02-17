import "reflect-metadata"

import '@picocss/pico'
import { SessionProvider } from "next-auth/react"
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { Provider } from "react-redux"
import { Header } from "../components/header/Header"
import { setBackendUrl, store } from './store'

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    if (typeof window !== "undefined") {
        const currentHost = `${window.location.protocol}//${window.location.host}`
        if (store.getState().global.backendUrl !== currentHost) {
            store.dispatch(setBackendUrl(currentHost))
        }
    }
    useEffect(() => {
        Notification.requestPermission()
    }, [])

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
                <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                <meta name="theme-color" content="#317EFB" />
            </Head>
            <SessionProvider session={session}>
                <Provider store={store}>
                    <Header></Header>
                    <Component {...pageProps} />
                </Provider>
            </SessionProvider>
        </>
    )
}
