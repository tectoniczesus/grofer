import {Inngest} from 'inngest';

import {connectDB} from "./db.js";
import User from "../models/user.models.js";

export const inngest = new Inngest({id:"grofer"});
//DONE: the fix for inngest issue done
//?: the problem was new version got another way of adding the triggers and functions
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkID: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}` || "User",
      imageURL: image_url,
      addresses: [],
      wishlist: [],
    };

    await User.create(newUser);
  }
);

const deleteUserFromDB = inngest.createFunction(
    {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
    async({event})=>{
        await connectDB();
        const{id} = event.data;
        await User.deleteOne({clerkID:id});
    }
);


export const functions = [syncUser, deleteUserFromDB];