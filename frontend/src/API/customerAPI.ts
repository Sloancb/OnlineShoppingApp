import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';
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
            sendMessage('error', "Rigstration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout= (navigate:NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};

export interface allCustomerData {
    customer : Object,
    address : Object,
    creditCards : Array<any>

}
export async function fetchByName(name:string):Promise<allCustomerData>{
    let customerData:allCustomerData = {customer:"", address:"", creditCards:[]}
    await request(config.endpoint.customers + '/fetchByName','POST', {name:name})
        .then((response) => {
            // handle successful GetCustomer
            
            customerData = response
            console.log("customerData", customerData)
        })
        .catch((error) => {
            // handle GetCustomer error
            console.log("error", error);
        });
    return customerData
}

export async function updateCustomer(user_id:number, name:string, email:string, address:string, cardData:Array<any>){
    request(config.endpoint.customers + '/update','POST', {customer_id:user_id, name:name, email:email, address:address, creditCards:cardData})
        .then((response) => {
            // handle successful update
            console.log("response", response)
            window.sessionStorage.setItem('user', name);
        })
        .catch((error) => {
            // handle update error
            console.log("error", error);
        });
}

export async function createCreditCard(user_id:number, cardNumber:number, billingAddress:string, expiryDate:string){
    request(config.endpoint.customers + '/createCreditCard','POST', {customer_id:user_id, card_number:cardNumber, billing_address:billingAddress, expiry_date:expiryDate})
        .then((response) => {
            // handle successful add
            console.log("Create Credit Card Successful")
            console.log("response", response)
        })
        .catch((error) => {
            // handle add error
            console.log("error", error);
        });
}