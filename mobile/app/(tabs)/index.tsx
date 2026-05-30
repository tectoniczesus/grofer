import { View, Text, ScrollView } from 'react-native'
import SafeScreen from '@/components/SafeScreen'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
const ShopScreen = () => {
  return (
    <SafeScreen>
      <ScrollView className='flex-1' contentContainerStyle={{paddingBottom:100}} showsVerticalScrollIndicator = {false}>
        {/**Header */}
        <View className='px-6 pb-6 pt-6'>
          <View className='flex-row items-center justify-between mb-6'>
            <View>
              <Text className='text-text-primary text-3xl font-bold tracking-tight'>Shop</Text>
              <Text className='text-text-secondary text-sm mt-1'>Browse all product</Text>
            </View>
            <TouchableOpacity className='bg-surface/50 p-3 rounded-full'>
             <Ionicons name = "options-outline" size={22} color={"#fff"}/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default ShopScreen