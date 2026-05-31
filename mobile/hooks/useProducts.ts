import { useAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

const useProducts = () => {
  
  const api  = useAPI();

   const result = useQuery({
    queryKey:["products"],
    queryFn: async()=>{
      
      
      const {data} = await api.get<Product[]>("/product");
      return data;
    },
   });
   return result;
};

export default useProducts;