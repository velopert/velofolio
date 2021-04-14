import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import recoilInitializer from './atoms/recoilInitializer'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient()
ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>Velofolio</title>
      </Helmet>
      <RecoilRoot initializeState={recoilInitializer}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </RecoilRoot>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
