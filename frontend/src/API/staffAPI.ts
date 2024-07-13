import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage } from '../styling/components.tsx';

export interface loginData {
    name : string, 
    password : string
}
export interface staffData {
    name : string
    email : string
    password : string
    job_title : string
    salary : string
}
export async function postStaff(data : staffData):Promise<boolean>{
    let isRegistered = false
    await request(config.endpoint.staff +'/Register', 'POST', {...data})
        .then((response) => {
            // handle successful login
            console.log("response", response)
            sendMessage('success', "Staff Regstration Successful")
            isRegistered = true
        })
        .catch((errorMessage) => {
            // handle login error
            console.log("error", errorMessage);            
            sendMessage('error', "Staff Regstration  Failed:" + errorMessage)
        });
    return isRegistered
};
export const HandleLogout= (navigate:NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};