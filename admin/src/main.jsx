import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {ClerkProvider} from "@clerk/react"
import {BrowserRouter} from "react-router";
import * as Sentry from "@sentry/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import App from './App.jsx'


const publishKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!publishKey){
  throw new Error("publish key is missing");
}
const queryClient = new QueryClient();


Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs:true,
  integrations: [
    Sentry.replayIntegration()
  ],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ClerkProvider publishableKey={publishKey}>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
