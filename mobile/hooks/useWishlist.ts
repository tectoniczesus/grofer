import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAPI } from "@/lib/api"
import { Product } from "@/types"


const useWishlist = ()=>{

    const api = useAPI();
    const queryClient = useQueryClient();
    const {
        data: wishlist,
        isLoading,
        isError,
    } = useQuery({
        queryKey:["wishlist"],
        queryFn: async()=>{
            const{data} = await api.get<{wishlist: Product[]}>("/user/wishlist");
            return data.wishlist;
        },
    });

    const adddToWishlistMutation = useMutation({
        mutationFn: async (productId: string)=>{
            const {data} = await api.post<{wishlist:string[]}>("/user/wishlist",{productId});
            return data.wishlist;
        },
        onSuccess: ()=> queryClient.invalidateQueries({queryKey:["wishlist"]}),
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: async(productId: string)=>{
            const {data} = await api.delete<{wishlist: string[]}>(`/user/wishlist/${productId}`);
            return data.wishlist;
        },
        onSuccess:()=> queryClient.invalidateQueries({queryKey:["wishlist"]}),
    });
    const isInWishlist = (productId: string)=>{
        return wishlist?.some((product)=> product._id === productId) ?? false;
    }

    const toggleWishlist = (productId: string)=>{
        if(isInWishlist(productId)){
            removeFromWishlistMutation.mutate(productId);
        }else{
            adddToWishlistMutation.mutate(productId);
        }
    };
    return{
     wishlist: wishlist || [],
     isLoading,
     isError,
     wishlistCount: wishlist?.length || 0,
     isInWishlist,
     toggleWishlist,
     addToWishlist: adddToWishlistMutation.mutate,
     removeFromWishlist: removeFromWishlistMutation.mutate,
     isAddingToWishlist: adddToWishlistMutation.isPending,
     isRemovingFromWishlist: removeFromWishlistMutation.isPending,


    };
};

export default useWishlist;