import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {ClerkProvider} from "@clerk/react"
import App from './App.jsx'


const publishKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!publishKey){
  throw new Error("publish key is missing");
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishKey}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
