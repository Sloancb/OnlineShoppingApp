import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage, Product } from '../styling/components.tsx';
import customer from '../../../backend/models/customer.js';
import { all } from 'axios';

export interface loginData {
    name : string, 
    password : string
}
export async function getLogin(data : loginData){    
    let name = data.name
    let password  = data.password
    let loggedIn = false
    await request(config.endpoint.customers + '/login', 'POST', { name, password })
        .then((response) => {
            if(response != null){
                console.log("response", response)
                sendMessage('success', "Login Successful")
                localStorage.setItem("jwt", JSON.stringify(data["token"]))
                window.sessionStorage.setItem("id", JSON.stringify(response.customer.id))
            }
            else {
                console.log("data is null")
            }
            loggedIn = true
        })
        .catch((errorMessage) => {
            console.log("error", errorMessage);
            sendMessage('error', "Login  Failed:" + errorMessage) 
        });
    return loggedIn
};
export interface customerData {
    email : string, 
    name : string, 
    password : string
}
export async function postCustomer(data : customerData):Promise<boolean>{
    let email = data.email
    let name = data.name
    let password  = data.password
    let isRegistered = false
    await request(config.endpoint.customers +'/Register', 'POST', { name, email, password })
        .then((response) => {
            // handle successful login
            console.log("response", response)
            sendMessage('success', "Register Successful")
            isRegistered = true
        })
        .catch((errorMessage) => {
            // handle login error
            console.log("error", errorMessage);            
            sendMessage('error', "Regstration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout= (navigate: NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};



// ------ Home Page
export interface cartItem {
    product_id : number,
    customer_id : number,
    quantity : number
};

export async function getCartItemCount(): Promise<number> {
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return -1;
        }
        const customerId = parseInt(c_id, 10);
        
        const response = await request<cartItem[]>(
            `${config.endpoint.carts}/getItems/${customerId}`, 'GET'
        );

        if (!response) {
            return -1;
        }

        const itemCount = response.length;
        return itemCount;
    } catch (error) {
        sendMessage('error', "Failed to count");
        return -1;
    }
};

export async function handleAddToCart(product: Product, quantity: number) {
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return;
        }
        const current_customer_id = parseInt(c_id, 10);

        const cart_item: cartItem = {
            product_id: product.id,
            customer_id: current_customer_id,
            quantity: quantity
        };

        // add to cart
        request<cartItem>(config.endpoint.carts +'/addToCart', 'POST', cart_item);

        sendMessage('success', `Added ${quantity} ${product.name}(s) to cart!`)
    } catch (error) {
        sendMessage('error', "Failed to add item to cart");
        console.error('Error adding to cart: ', error);
    }
};

export async function getCartItems(){
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return -1;
        }
        const customerId = parseInt(c_id, 10);
        
        const response = await request<cartItem[]>(
            `${config.endpoint.carts}/getItems/${customerId}`, 'GET'
        );

        if (!response) {
            return -1;
        }

        return response;
    } catch (error) {
        sendMessage('error', "Failed to retrieve cart");
        return -1;
    }
};

