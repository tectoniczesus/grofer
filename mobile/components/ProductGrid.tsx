import { View, Text } from 'react-native'
import { Product } from '@/types';
import useWishlist from '@/hooks/useWishlist';
interface ProductGridProps{
  isLoading: boolean;
  isError: boolean;
  products : Product[];
}

const ProductGrid = ({products, isLoading, isError}: ProductGridProps) => {
  const {isInWishlist,toggleWishlist,isAddingToWishlist,isRemovingFromWishlist} = useWishlist();
  
  return (
    <View>
      <Text className='text-white'>ProductGrid</Text>
    </View>
  )
}

export default ProductGrid