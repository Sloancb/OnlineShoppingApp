import {request} from './Requests.ts'
import config from '../config.json';
import { NavigateFunction } from "react-router-dom";
import { sendMessage, Product, CreditCard } from '../styling/components.tsx';
import customer from '../../../backend/models/customer.js';
import { all } from 'axios';
import order from '../../../backend/models/order.js';

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
                console.log(response)
                sendMessage('success', "Login Successful")
                localStorage.setItem("jwt", JSON.stringify(response["token"]))
                loggedInAs = "customer"
                window.sessionStorage.setItem("id", JSON.stringify(response.user.id))
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
    password : string,
    address : string
}
export async function postCustomer(data : customerData):Promise<boolean>{
    let email = data.email
    let name = data.name
    let password  = data.password
    let address = data.address
    let isRegistered = false
    await request(config.endpoint.customers +'/Register', 'POST', { name, email, password, address })
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
export const HandleLogout= (navigate: NavigateFunction)=>{
    localStorage.clear()
    navigate('/Login')
};

//--- Account Page
export interface allCustomerData {
    customer : Object,
    address : Object,
    creditCards : Array<any>

}
export async function fetchByName(name:string):Promise<allCustomerData>{
    let customerData:allCustomerData = {customer:{}, address:{}, creditCards:[]}
    await request(config.endpoint.customers + '/fetchByName','POST', {name:name})
        .then((response) => {
            // handle successful GetCustomer
            
            customerData = response
            if(customerData.customer === null){
                customerData.customer = {name:"", email:""}
            }
            if(customerData.address === null){
                customerData.address = {address:""}
            }
            if(customerData.creditCards === null){
                customerData.creditCards = []
            }
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


// ------ Home Page
export interface cartItem {
    product_id : number,
    customer_id : number,
    quantity : number,
    name: string,
    category: string,
    price: number
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
        
        let itemCount = -1;
        try{
            itemCount = response.reduce((a,b)=>{return a + b.quantity},0)
        } 
        catch{
            itemCount = -1
        }
        return itemCount;
    } catch (error) {
        sendMessage('error', "Failed to count");
        return -1;
    }
};

export async function handleAddToCart(product: Product, quantity: number) {
    try {
        console.log("ran 2")
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return;
        } else {
            const current_customer_id = parseInt(c_id, 10);

            const cart_item = {
                product_id: product.id,
                customer_id: current_customer_id,
                quantity: quantity
            };

            // add to cart
            await request<cartItem>(config.endpoint.carts +'/addToCart', 'POST', cart_item)
            .then(()=>{
                const event = new CustomEvent('updateCart', {bubbles:true})
                window.dispatchEvent(event)
                sendMessage('success', `Added ${quantity} ${product.name}(s) to cart!`)
            }).catch()
        }
    } catch (error) {
        sendMessage('error', "Failed to add item to cart");
        console.error('Error adding to cart: ', error);
    }
};

export async function getCartItems(): Promise<cartItem[]> {
    let acc : cartItem[] = [];
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (c_id === null) {
            sendMessage('error', "Account not logged in");
        } else {
            const customerId = parseInt(c_id, 10);
            
            await request<cartItem[]>(
                `${config.endpoint.carts}/getItemsInfo/${customerId}`, 'GET'
            ).then((response) => {
                if (!response) {
                    sendMessage('error', "No Cart Items");
                }
                acc = response;
            })
        }
    } catch (error) {
        sendMessage('error', "Failed to retrieve cart");
    }
    return acc;
};

export async function getCartTotalValue(): Promise<number> {
    let total_amount = 0.0;
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
        } else {
            const customerId = parseInt(c_id, 10);
            
            await request<cartItem[]>(
                `${config.endpoint.carts}/getItemsInfo/${customerId}`, 'GET'
            ).then((response) => {
                if (!response) {
                    sendMessage('error', "No Cart Items");
                }
                for (let cartItem in response){
                    total_amount += response[cartItem].quantity * response[cartItem].price;
                    console.log(total_amount);
                }
            })
        }
    } catch (error) {
        sendMessage('error', "Failed to retrieve cart");
    }
    return total_amount;
};
export async function getCustomerDetails(){
    let acc = [];
    try {
        let c_id = window.sessionStorage.getItem('id');     // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
        } else {
            const customerId = parseInt(c_id, 10);
            
            await request(
                `${config.endpoint.carts}/fetchByID/${customerId}`, 'GET'
            ).then((response) => {
                if (!response) {
                    sendMessage('error', "Can't get info on credit cards and addresses");
                }
                acc = response;
            })
        }
    } catch (error) {
        sendMessage('error', "Failed to retrieve customer info");
    }
    return acc;
}

export async function createOrder(delivery_type: string, creditCard: CreditCard, cartItems: cartItem[], total_amount:number){
    let orderData = []
    try {
        let delivery_price = 4.99;
        let delivery_date = new Date(new Date().setDate(new Date().getDate() + 2));
        let ship_date = new Date(new Date().setDate(new Date().getDate() + 1));
        if(delivery_type == 'Express'){
            delivery_price = 9.99;
            delivery_date = ship_date;
            ship_date = new Date();
        }
        const deliveryPlanResponse = await request(config.endpoint.orders + '/deliveryPlan', 'POST', {delivery_type, delivery_price, delivery_date, ship_date});
        console.log("Create Delivery Plan Successful");
        console.log("response", deliveryPlanResponse);

        let c_id = window.sessionStorage.getItem('id'); // customer id
        if (!c_id) {
            sendMessage('error', "Account not logged in");
            return;
        }
        
        const customerId = parseInt(c_id, 10);
        const orderResponse = await request(config.endpoint.orders + '/', 'POST', {customer_id: customerId, products: cartItems, total_amount: total_amount, delivery_plan_id: deliveryPlanResponse["id"], payment_method_id: creditCard["id"]});
        console.log("Order Successfully created!");
        console.log("response", orderResponse);
        orderData = orderResponse;

        const emptyCartResponse = await request(config.endpoint.carts + '/empty', 'DELETE', {customer_id: customerId});
        console.log("Cart Empty!");
        console.log("response", emptyCartResponse);
        
        return orderData;
    } catch(error){
        console.log("error", error);
    }
    //return orderData
}