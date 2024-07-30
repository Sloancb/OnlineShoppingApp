import React, { useState } from 'react';
import config from '../config.json';
import {generate} from 'random-words';

import { request } from '../API/Requests.ts';
import { CircularProgress } from '@mui/material';
import { testProducts } from './testData.ts';
import HomeBar, { sendMessage, Product, Cart } from '../styling/components.tsx';
import { handDeleteAllProducts, postProduct } from '../API/productAPI.ts';
import { delay } from '../styling/support.ts';

const genProd = () =>{
    let prod : Product= {
        id : Math.random() * 100,
        name : String(generate(1)),
        category : String(generate(1)),
        size : String(generate(1)),
        brand : String(generate(1)),
        description : String(generate(20)),
        price : +(Math.random() % 90 * 100).toPrecision(4)
    }
    return prod
}
const TestPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const handlePostAllProducts = async () => {
        setLoading(true);
        for (let i of Array.from(Array(1000).keys())){
            await postProduct(genProd())
            await delay(10)
        }
        setLoading(false);
    }

    const handleCustomerFetchAll = () => {
        setLoading(true);
        request(config.endpoint.customers + '/fetchAll','GET')
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
    };
    const handleCustomerDeleteAll = () => {
        setLoading(true);
        request(config.endpoint.customers+'/deleteAll','DELETE')
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
    };

    const handleCreateCart = () => {
        console.log("handleCreateCart");
        setLoading(true);
        request<Cart>(config.endpoint.checkout +'/', 'POST', {customer_id: 1})
            .then((response) => {
                // handle successful login
                console.log("response", response)
                request<Product>(config.endpoint.checkout +'/checkoutItem', 'POST', {customer_id: 1, product: testProducts[0], quantity: 1})
                    .then((response) => {
                        console.log("product added", response)
                        request<Product>(config.endpoint.checkout +'/checkoutItem', 'POST', {customer_id: 1, product: testProducts[1], quantity: 3})
                            .then((response) => {
                                console.log("product added", response)
                                request<Product>(config.endpoint.checkout +'/checkoutItem', 'POST', {customer_id: 1, product: testProducts[3], quantity: 2})
                                    .then((response) => {
                                        console.log("product added", response)
                                        setLoading(false);
                                    })
                                    .catch((error) => {
                                        // handle login error
                                        console.log("error", error);
                                        setLoading(false);
                                    });
                            })
                            .catch((error) => {
                                // handle login error
                                console.log("error", error);
                                setLoading(false);
                            });
                    })
                    .catch((error) => {
                        // handle login error
                        console.log("error", error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
                
            
               
    }
    const handleCartDeleteAll = () => {
        setLoading(true);
        request(config.endpoint.checkout+'/deleteAll','DELETE')
            .then((response) => {
                // handle successful login
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle login error
                console.log("error", error);
                setLoading(false);
            });
    };
    return (
        <div>
            <HomeBar>
            <div style= {{display:"dflex"}}>
                <h1>Test Page</h1>
            </div>
            {loading && <CircularProgress size={20}  style={{textAlign:"center", padding:3}}/>}
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={handleCustomerFetchAll}>handleCustomerFetchAll</button>
                <button onClick={handleCustomerDeleteAll}>handleCustomerDeleteAll</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={handlePostAllProducts}>handlePostProduct</button>
                <button onClick={handDeleteAllProducts}>handDeleteAllProduct</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={handleCreateCart}>handleCreateCart</button>
                <button onClick={handleCartDeleteAll}>handleDeleteAllCart</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={()=>{
                    localStorage.clear()
                    console.log("Local Storage Cleared")
                }}>Clear LocalStorage</button>
                <button onClick={()=>{
                    sessionStorage.clear()
                    console.log("session Storage Cleared")
                }}>Clear sessionStorage</button>
            </div>
            <br/>
            <div style= {{display:"dflex"}}>
                <button onClick={()=>{sendMessage("error", "Test error message") }}>send error message</button>
                <button onClick={()=>{sendMessage('success', "Test success message")}}>send success message</button>
                <button onClick={()=>{sendMessage('info', "Test info message")}}>send info message</button>
                <button onClick={()=>{sendMessage('warning', "Test warning message")}}>send warning message</button>
            </div>
            </HomeBar>
        </div>
    );
};

export default TestPage;