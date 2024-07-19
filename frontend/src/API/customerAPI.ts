import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';

export interface loginData {
    name : string, 
    password : string
}
export async function getLogin(data : loginData):Promise<string>{    
    let name = data.name
    let password  = data.password
    let loggedInAs = ""
    await request(config.endpoint.customers + '/login', 'POST', { name, password })
        .then((response) => {
            if(response != null){
                sendMessage('success', "Login Successful")
                localStorage.setItem("jwt", JSON.stringify(response["token"]))
                loggedInAs = "customer"
                if(response["adminToken"]) {
                    localStorage.setItem("adminToken", JSON.stringify(response["adminToken"]))
                    loggedInAs = "staff"
                }
            }
            else {
                console.log("data is null")
            }
            
        })
        .catch((errorMessage) => {
            console.log("error", errorMessage);
            sendMessage('error', "Login  Failed:" + errorMessage) 
        });
    return loggedInAs
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
            sendMessage('error', "Registration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout= (navigate:NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};