import axios from 'axios';
import configData from '../config.json';
export async function request<T>(endpoint: string, method: string, data: any) {
    let url = configData.backendUrl + endpoint;
    await axios({
        method: method,
        url:url, 
        data: JSON.stringify(data),
        timeout: 5000,
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log("API Error", error);
        throw error;
    });
}
