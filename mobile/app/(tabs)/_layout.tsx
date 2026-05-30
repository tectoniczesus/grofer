import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs ,Redirect} from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { useAuth } from '@clerk/expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {BlurView} from  'expo-blur'
const TabsLayout = () => {

  const {isSignedIn,  isLoaded} = useAuth();
  const inset = useSafeAreaInsets()
  if(!isLoaded) return null;
  if(!isSignedIn) return <Redirect href = {"/(auth)"}/>
  return (
    <Tabs
     screenOptions={{
      tabBarActiveTintColor:"#e3364d",
      tabBarInactiveTintColor:"#ebb7be",

      tabBarStyle:{
        position:"absolute",
        backgroundColor:"transparent",
        borderTopWidth:0,
        height:32 + inset.bottom,
        paddingTop:4,
        marginHorizontal: 100,
        marginBottom:30,
        borderRadius:24,
        overflow:"hidden"
      },
      tabBarBackground:()=>(
        <BlurView intensity={80} tint='dark'  style={StyleSheet.absoluteFill}/>
  ),
      tabBarLabelStyle:{
        fontSize:12,
        fontWeight:600
      },
      headerShown:false
     }}
    >
      <Tabs.Screen
      name="index"
      options={{
       title:"Shop",
       tabBarIcon:({color,size}) => <Ionicons name = "grid" size={size} color={color}/>
      }}
      />

      <Tabs.Screen
      name="cart"
      options={{
       title:"Cart",
       tabBarIcon:({color,size}) => <Ionicons name = "cart" size={size} color={color}/>
      }}
      />

      <Tabs.Screen
      name="profile"
      options={{
       title:"Profile",
       tabBarIcon:({color,size}) => <Ionicons name = "person" size={size} color={color}/>
      }}
      />
    </Tabs>
  )
}

export default TabsLayout