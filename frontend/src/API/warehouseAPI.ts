import { request } from "./Requests.ts"
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';

export interface Warehouse {
    id : number,
    address: string,
    capacity: number,
    currentCapacity: number,
}
export async function fetchAllWarehouses():Promise<Warehouse[]>{
    let warehouses : Warehouse[] = []
    await request<Warehouse[]>(config.endpoint.warehouse + '/fetchAll', 'GET')
    .then((response) => {
        warehouses =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return warehouses
};

