import { View, Text, ScrollView, TextInput } from 'react-native'
import SafeScreen from '@/components/SafeScreen'
import { TouchableOpacity,Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState, useMemo } from 'react'
import ProductGrid from '@/components/ProductGrid'
import useProducts from '@/hooks/useProducts'
const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];
const ShopScreen = () => {

  const [searchQuery, setSearchQuery] = useState("");
   const [selectCategory, setSelectCategory] = useState("All");
   const {data: products, isLoading, isError} = useProducts();

   const filteredProducts  =   useMemo(()=>{
    if(!products) return [];
    let filtered = products;
    if(selectCategory !== "All"){
      filtered = filtered.filter((products) => products.category === selectCategory);
    }

    if(searchQuery.trim()){
      filtered = filtered.filter((products)=>{
        products.name.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    return filtered;

   },[products, selectCategory, searchQuery]);
   
   
   
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
            <TouchableOpacity className='bg-surface/50 p-3 rounded-full' activeOpacity={0.6}>
             <Ionicons name = "options-outline" size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>
             {/*Search bar components */}
        <View className='bg-surface flex-row items-center px-5 py-4 rounded-2xl'>
          <Ionicons color = {"#666"} size={22} name = "search"/>
         <TextInput
         placeholder='search for products'
         placeholderTextColor={"#666"}
         className='flex ml-1 text-base text-text-primary'
         value={searchQuery}
         onChangeText={setSearchQuery}
         />
        </View>
        </View>

        {/* category filter */}
         <View className='mb-6'>
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal:20}}
          >
            
            {CATEGORIES.map((category)=>{
              const isSelected = selectCategory === category.name;
              return (
                <TouchableOpacity
                key={category.name}
                onPress={()=> setSelectCategory(category.name)}
                className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center 
                  ${isSelected? "bg-primary" : "bg-surface"}
                  `}
                >
                  {category.icon ?(
                    <Ionicons
                     name = {category.icon}
                     size = {36}
                     color={isSelected ? "#121212" : "#fff"}

                    />
                  ):(
                    <Image source={category.image} className='size-12' resizeMode='contain'/>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
         </View>
        

        <View className='px-6 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-text-primary text-lg font-bold'>
              Products
            </Text>
            <Text className='text-text-primary text-sm'>
              {filteredProducts.length} items
            </Text>
          </View>
          {/* Product grid */}
          <ProductGrid products = {filteredProducts} isLoading={isLoading} isError = {isError}/>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default ShopScreen