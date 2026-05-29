import {Redirect,Stack} from 'expo-router'
import {useAuth} from "@clerk/expo";

export default function AuthLayout() {

    const{isSignedIn} = useAuth()
    // thing are working fine but 

    // getting user and logging user in console too
    // only maximum dept limit reached error is comming gonna need to fix that
    
    // if(isSignedIn){
    //     return <Redirect href={"/"}/>
    // }
    return <Stack screenOptions={{headerShown:false}}/>
}