import { useAPI } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/types";

type AddressResponse = {
    address: Address[];
};

export const useAddresses=()=>{
    const api = useAPI();
    const queryClient = useQueryClient();

      const {data:addresses, isLoading, isError} = useQuery({
        queryKey:["addresses"],
        queryFn:async()=>{
            const {data} = await api.get<AddressResponse>("/user/address");
            return data.address;
        }
        
      })
     
    const addAddressesMutation = useMutation({
        mutationFn: async (addressData: Omit<Address, "_id">)=>{
            const{data} = await api.post<AddressResponse>("/user/address",addressData);
            return data.address;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["addresses"]});
        }

    })

    const updateAddressesMutation = useMutation({
     mutationFn: async({
        addressId,
        addressData,
     }:{
        addressId:string,
        addressData: Partial<Address>;
     })=>{
        const {data} = await api.put<AddressResponse>(`/user/address/${addressId}`, addressData)
        return data.address;
     },
     onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["addresses"]});
     }
    })

    const deleteAddressesMutation = useMutation({
     mutationFn: async(addressId:string)=>{
        const {data} = await api.delete<AddressResponse>(`/user/address/${addressId}`);
        return data.address;
     },
     onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey:["addresses"]});
     }
    })

    return {
     addresses: addresses || [],
     isLoading,
     isError,
     addAddress:addAddressesMutation.mutate,
     updateAddress: updateAddressesMutation.mutate,
     deleteAddress: deleteAddressesMutation.mutate,
     isAddingAddress: addAddressesMutation.isPending,
     isUpdatingAddress: updateAddressesMutation.isPending,
     isDeletingAddress : deleteAddressesMutation.isPending,
    }

    

}
