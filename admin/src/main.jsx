import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {ClerkProvider} from "@clerk/react"
import {BrowserRouter} from "react-router";
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
