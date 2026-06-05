import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useAPI } from "@/lib/api";
import { useAddresses } from "@/hooks/useAddresses";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import { Address } from "@/types";
import * as Sentry from "@sentry/react-native"
const CartScreen = () => {
  const api = useAPI();
  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const { addToCart, isAddingToCart } = useCart();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const { addresses } = useAddresses();

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      return updateQuantity({ productId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (productId:string, productName:String)=>{
    Alert.alert("Remove item", `Remove ${productName} from cart?`,[
     {text:"Cancel",style:"cancel"},
     {
      text:"Remove",
      style:"destructive",
      onPress:()=>removeFromCart(productId),
     }
    ])
  }

  const handleCheckout = ()=>{
    if(cartItems.length === 0){
      Alert.alert("No Address",
        "Please add a shipping address in you profile before checking out.",
      [{text:"OK"}]);
      return;
    }

    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async(selectedAddress:Address)=>{
    setAddressModalVisible(false);

    Sentry.logger.info("Checkout initiated",{
      itemCount: cartItemCount,
      total:total.toFixed(2),
      city:selectedAddress.city,
    });

    try {
      setPaymentLoading(true);

      const{data} = await api.post("/payment/create-intent",{
        cartItems,
        shippingAddress:{
          fullName:selectedAddress.fullName,
          streetAddress:selectedAddress.streetAddress,
          city:selectedAddress.city,
          state:selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber:selectedAddress.phoneNumber,
        },
      });

      const {error:initError} = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "You Store Name",
      });
      if(initError){
        Sentry.logger.error("Payment sheet init failed",{
          errorCode:initError.code,
          errorMessage: initError.message,
          cartTotal: total,
          itemCount:cartItems.length,
        })
        Alert.alert("Error",initError.message);
        setPaymentLoading(false);
        return;
      }
      const {error:presentError} = await presentPaymentSheet();
      if(presentError){
        Sentry.logger.error("Payment cancelled",{
          errorCode:presentError.code,
          errorMessage:presentError.message,
          cartTotal: total,
          itemCount:cartItems.length,
        });
        Alert.alert("Payment cancelled",presentError.message);

      }else{
        Sentry.logger.info("Payment successful",{
          total:total.toFixed(2),
          itemCount: cartItems.length,
        });
        Alert.alert("Success","Your payment was successful! Your order is being processed.",[
          {text:"OK",onPress:()=>{}},
        ]);
        clearCart();
      }
    } catch (error) {
      Sentry.logger.error("Payment failed",{
        error: error instanceof Error ? error.message : "Unknown error",
        cartTotal: total,
        itemCount : cartItems.length,
      });
      Alert.alert("Error","Failed to process payment");
    }finally{
      setPaymentLoading(false);
    }
  }
  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;

  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tighter">
        Cart
      </Text>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-2">
          {cartItems.map((item, index) => (
            <View
              key={item._id}
              className="bg-surface rounded-3xl overflow-hidden"
            >
              <View className="p-4 flex-row ">
                {/*product image */}
                <View className="relative">
                  <Image
                    source={item.product.images[0]}
                    className="bg-background-light"
                    contentFit="cover"
                    style={{ width: 112, height: 112, borderRadius: 16 }}
                  />
                  <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                    <Text className="text-background text-xs font-bold">
                      x{item.quantity}
                    </Text>
                  </View>
                </View>
                <View className="flex-1 ml-4 justify-center">
                  <View>
                    <Text
                      className="text-text-primary font-bold text-lg leading-tight "
                      numberOfLines={2}
                    >
                      {item.product.name}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-primary font-bold text-2xl">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                      <Text className="text-text-secondary text-sm ml-2">
                        ${item.product.price.toFixed(2)} each
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity,
                          -1,
                        )
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary font-bold text-lg">
                        {item.quantity}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                       onPress={()=>handleQuantityChange(item.product._id, item.quantity,1)}
                       disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Ionicons name="add" size={18} color="#121212" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                      activeOpacity={0.7}
                       onPress={()=> handleRemoveItem(item.product._id, item.product.name)}
                       disabled={isRemoving}
                    > 
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total}/>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface pt-4 pb-32 px-6">

        {/*Quick stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#FF6B6B"/>
            <Text className="text-text-secondary ml-2">{cartItemCount} {cartItemCount === 1 ? "item":"items"}</Text>
          </View>
        
        <View className="flex-row items-center">
          <Text className="text-text-primary font-bold text-xl">${total.toFixed(2)}</Text>
        </View>
      </View>
      {/*checkout  */}
      <TouchableOpacity
      className="bg-primary rounded-2xl overflow-hidden"
      activeOpacity={0.9}
      onPress={handleCheckout}
      disabled={paymentLoading}
      >
        <View className="py-5 flex-row items-center justify-center">
          {paymentLoading ? (
        <ActivityIndicator size="small"  color="#121212"/>
          ):(

            <>
            <Text className="text-background font-bold text-lg mr-2">Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#121212"/>
            </>
          )}
        </View>
      </TouchableOpacity>
      </View>
      <AddressSelectionModal
      visible={addressModalVisible}
      onClose={()=> setAddressModalVisible(false)}
      onProceed={handleProceedWithPayment}
      isProcessing={paymentLoading}
      
      />
    </SafeScreen>
  );
};

export default CartScreen;

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FFFFFF" />
      <Text className="text-text-primary font-semibold text-xl mt-4">
        Failed to load cart
      </Text>
      <Text className="text-text-secondary text-center mt-2">
        Please check you connection and try again later
      </Text>
    </View>
  );
}

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#00d9ff" />
      <Text className="text-text-secondary mt-4">Loading cart....</Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">
          Cart
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your cart is empty
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Add some product to get started
        </Text>
      </View>
    </View>
  );
}
