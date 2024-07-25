import { request } from "./Requests.ts"
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';

export interface Stock {
    id : number,
    productId: string,
    warehouseId: string,
    name: string,
    description: string,
    quantity: number
}
export async function fetchAllStock():Promise<Stock[]>{
    let stock : Stock[] = []
    await request<Stock[]>(config.endpoint.stock + '/fetchAll', 'GET')
    .then((response) => {
        stock =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return stock
};

export async function fetchStock(warehouse_id:number):Promise<Stock[]>{
    let stock : Stock[] = []
    let url = config.endpoint.stock + '/fetchStock' + '?warehouseId=' + warehouse_id
    await request<Stock[]>(url, 'GET')
    .then((response) => {
        stock =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return stock
};

export async function addStock(productId:number, warehouseId:number, quantity:number){
    let stock
    await request<Stock[]>(config.endpoint.stock + '/addStock', 'POST', {quantity, warehouseId, productId,})
    .then((response) => {
        stock =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return stock
};

export async function editStock(productId:number, warehouseId:number, quantity:number){
    let stock
    await request<Stock[]>(config.endpoint.stock + '/editStock', 'POST', {productId, warehouseId, quantity})
    .then((response) => {
        stock =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return stock
};