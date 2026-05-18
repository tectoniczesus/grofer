import React from 'react'
import { Loader2Icon } from "lucide-react";
function PageLoader() {
  return (
     <div className="items-center flex h-screen justify-center">
        <Loader2Icon className="size-12 animate-spin"/>
      </div>
  )
}

export default PageLoader
    