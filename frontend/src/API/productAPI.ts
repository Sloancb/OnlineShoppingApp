import { request } from "./Requests.ts"
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';

export interface Product {
    id : number,
    name: string,
    category: string,
    brand: string,
    size: string,
    description: string,
    price: number
}
export async function postProduct(data:Product) {
    request<Product>(config.endpoint.products +'/', 'POST', {...data})
        .then((response) => {
            console.log("product saved", response)
        })
        .catch((error) => {
            // handle login error
            console.log("error", error);
    });
}
export async function editProduct(data : Product):Promise<boolean>{
    let prodSaved = false
    await request(config.endpoint.products +'/editProduct', 'POST', { ...data })
        .then((response) => {
            // handle successful login
            console.log("response", response)
            sendMessage('success', "Product Saved Successfully")
            prodSaved = true
        })
        .catch((errorMessage) => {
            // handle login error
            console.log("error", errorMessage);            
            sendMessage('error', "Saving product failed:" + errorMessage)
        });
    return prodSaved
};
export async function fetchAllProducts():Promise<Product[]>{
    let prodsData : Product[] = []
    await request<Product[]>(config.endpoint.products + '/', 'GET')
    .then((response) => {
        prodsData =  response
    })
    .catch((errorMessage) => {
        // handle login error
        console.log("error", errorMessage);            
    });
    return prodsData
};

export async function handDeleteAllProducts(){
    console.log("handleDeleteAllProduct");
    request<Product>(config.endpoint.products +'/deleteAll', 'DELETE')
    .then((response) => {
        console.log("products deleted", response)
    })
    .catch((error) => {
        // handle login error
        console.log("error", error);
    });
}

export async function handDeleteProduct(id){
    console.log("handleDeleteAllProduct");
    request<Product>(config.endpoint.products +'/delete', 'DELETE', {id})
    .then((response) => {
        console.log("products deleted", response)
    })
    .catch((error) => {
        // handle login error
        console.log("error", error);
    });
}
