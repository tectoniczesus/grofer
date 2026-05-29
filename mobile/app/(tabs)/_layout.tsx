import { View, Text } from 'react-native'
import React from 'react'
import { Tabs ,Redirect} from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { useAuth } from '@clerk/expo'

const TabsLayout = () => {

  const {isSignedIn,  isLoaded} = useAuth();
  if(!isLoaded) return null;
  if(!isSignedIn) return <Redirect href = {"/(auth)"}/>
  return (
    <Tabs>
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