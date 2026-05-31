import { useAuth } from "@clerk/expo";
import axios from "axios"
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

//local will work in simulator
const API_URL = "http://localhost:3000/api";
//prod will work in physical device
//const API_URL = "https://grofer-w3lgn.sevalla.app/api"

const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const useAPI = ()=>{
    const {getToken} = useAuth();
    useEffect(()=>{
        const interceptor = api.interceptors.request.use(async (config)=>{
            const token = await getToken();

            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;

 
        });

        return ()=>{
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    return api;

}