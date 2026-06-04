import { View, Text } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import useCart from '@/hooks/useCart';
import { useAPI } from '@/lib/api';
import { useAddresses } from '@/hooks/useAddresses';

const CartScreen = () => {
  const api = useAPI();
  const{addToCart, isAddingToCart} = useCart();
  const{addresses} = useAddresses();
  return (
    <SafeScreen>
      <Text className='text-white'>CartScreen</Text>
    </SafeScreen>
  )
}

export default CartScreen