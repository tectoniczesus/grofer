import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({children}:{children:React.ReactNode}) => {
  const inset = useSafeAreaInsets()
    return (
    <View className='flex-1 bg-background' style={{paddingTop:inset.top}}>
      {children}
    </View>
  )
}

export default SafeScreen