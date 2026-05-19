import { UserButton } from "@clerk/react";
import { HomeIcon, ShoppingCart,ClipboardPen, UsersIcon, PanelLeftIcon } from "lucide-react"
import {useLocation} from "react-router";
export const NAVIGATION = [
  {name:"Dashboard", path:"/dashboard" , icons:<HomeIcon className="size-5"/>},
  {name:"Products", path:"/products" , icons:<ShoppingCart className="size-5"/>},
  {name:"Orders", path:"/orders" , icons:<ClipboardPen className="size-5"/>},
  {name:"Customers", path:"/customers" , icons:<UsersIcon className="size-5"/>}
  
]
function Navbar() {
  const location = useLocation();
  return (
    <div className="navbar w-full bg-base-300">
    <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
      <PanelLeftIcon className="size-5"/>
    </label>
    <div className="flex-1 px-4">
      <h1 className="text-xl font-bold">
        {NAVIGATION.find((item)=> item.path === location.pathname)?.name || "Dashboard"}
      </h1>
    </div>
    <div className="mr-5">
      <UserButton/>
    </div>
    </div>
  )
}

export default Navbar
