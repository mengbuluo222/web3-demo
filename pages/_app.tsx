import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth"
import type { ReactNode } from "react"
// import InstrumentationClient from '@/pages/instrumentation-client'

export default function App({ Component, pageProps }: AppProps) {

  
  return (
  
     <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
