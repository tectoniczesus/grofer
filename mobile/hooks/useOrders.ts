import { useAPI } from "@/lib/api"
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useOrders = ()=>{
const api= useAPI();

return useQuery<Order[]>({
    queryKey:["orders"],
    queryFn: async()=>{
        const {data} = await api.get("/order");
        return data.orders;
    }
});

}