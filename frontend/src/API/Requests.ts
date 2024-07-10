import axios, { AxiosResponse } from 'axios';
import configData from '../config.json';
export async function request<T>(endpoint: string, method: string, data?: any){
    
    let returnData;
    let url = configData.backendUrl + endpoint;
    const jwt = localStorage.getItem("jwt")
    await axios({
        method: method,
        url:url, 
        data: data,
        timeout: 5000,
        headers: {
            Authorization: jwt,
        },
    })
    .then((response) => {
        returnData =  response.data;
    })
    .catch((error) => {
        console.log("API Error", error);
        if(error.response && error.response.data){
            throw error.response.data.error;
        }
        throw error.message;
    });
    return returnData;
}
