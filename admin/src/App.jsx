import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import React from 'react'

function App() {
  return (
    <div>
      <h1>home page</h1>
       <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
}

export default App
