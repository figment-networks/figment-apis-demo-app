import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
