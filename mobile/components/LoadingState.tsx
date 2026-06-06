import { ActivityIndicator } from "react-native";
import {View,Text} from "react-native"
interface LoadingStateProps{
    message?:string;
    color?:string;
}
export function LoadingState({message="Loading..." ,
     color="#00D9FF"}:LoadingStateProps){
return(
    <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size={"large"} color={color}/>
        <Text
        className="text-text-secondary mt-4"
        >{message}</Text>
    </View>
)
}

