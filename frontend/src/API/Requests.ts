import axios from 'axios';
import configData from '../config.json';
export async function request<T>(endpoint: string, method: string, data?: any): Promise<T>{
    let url = configData.backendUrl + endpoint;
    let returnData;
    await axios({
        method: method,
        url:url, 
        data: data,
        timeout: 5000,
    })
    .then((response) => {
        returnData = response.data;
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
