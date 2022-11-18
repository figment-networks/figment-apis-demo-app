import type { AppProps } from 'next/app'
import { AppStateProvider } from '../components/AppState'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <AppStateProvider>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </AppStateProvider>
  )
}
