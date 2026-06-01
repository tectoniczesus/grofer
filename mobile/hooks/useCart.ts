import{useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import{useAPI} from "@/lib/api";
import {Cart} from "@/types";
//TODO: complete this hook
const useCart = () => {
  const api = useAPI();
  const queryClient = useQueryClient();
  const  addToCartMutation = useMutation({
    mutationFn: async ({productId, quantity = 1} : {productId:string, quantity?:number})=>{
        const {data} = await api.post<{cart: Cart}>("/cart",{productId, quantity});
        return data.cart;
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["cart"]})
  })

return {
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
};
}

export default useCart;