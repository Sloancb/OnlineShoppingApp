import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';
import customer from '../../../backend/models/customer.js';

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