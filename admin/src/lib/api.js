import axiosInstance from "./axios";
export const productApi = {
    getAll: async()=>{
        const {data} = await axiosInstance.get("/admin/products");
        return data;
    },
    create: async(form)=>{
        const {data} = await axiosInstance.post("/admin/products",form);
        return data;
    },
    update: async({id,form})=>{
        const {data} = await axiosInstance.put(`/admin/products/${id}`,form);
        return data;
    }
};
export const orderApi = {
    getAll : async()=>{
        const{data} = await axiosInstance.get("/admin/orders");
        return data;
    },
    updateStatus: async({orderId,status})=>{
     const{data} = await axiosInstance.patch(`/admin/orders/${orderId}/status`,{status});
     return data;
    },

};
export const statsApi = {
    getDashboard: async()=>{
        const{data} = await axiosInstance.get("/admin/stats");
        return data;
    },
}