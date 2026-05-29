import {Redirect,Stack} from 'expo-router'
import {useAuth} from "@clerk/expo";

export default function AuthLayout() {

    const{isSignedIn,isLoaded} = useAuth()
    if(!isLoaded) return null;
    // thing are working fine but 

    // getting user and logging user in console too
    // only maximum dept limit reached error is comming gonna need to fix that
    
    if(isSignedIn){
        return <Redirect href={"/(tabs)"}/>
    }
    return <Stack screenOptions={{headerShown:false}}/>
}