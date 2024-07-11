import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction, useNavigate } from "react-router-dom";
import RegisterPage from '../pages/RegisterPage.tsx';
import { message } from '../styling/components.tsx';

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
                let message : message = {exists: true, type:"success", message:"Login Successful"}
                sessionStorage.setItem('msg', JSON.stringify(message))
                localStorage.setItem("jwt", JSON.stringify(data["token"]))
            }
            else {
                console.log("data is null")
            }
            loggedIn = true
        })
        .catch((errorMessage) => {
            console.log("error", errorMessage);
            let message : message = {exists: true, type:"error", message:errorMessage}
            sessionStorage.setItem('msg', JSON.stringify(message))
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
            let message : message = {exists: true, type:"success", message:"Register Successful"}
            sessionStorage.setItem('msg', JSON.stringify(message))
            isRegistered = true
        })
        .catch((errorMessage) => {
            // handle login error
            console.log("error", errorMessage);
            let message : message = {exists: true, type:"error", message:errorMessage}
            sessionStorage.setItem('msg', JSON.stringify(message))
        });
    return isRegistered
};
export const HandleLogout= (navigate:NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};