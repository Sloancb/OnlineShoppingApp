import React, { useState } from 'react';
import config from '../config.json';

import { request } from '../API/Requests.ts';
import { CircularProgress } from '@mui/material';
import { testProducts } from './testData.ts';
import HomeBar, { sendMessage, Product } from '../styling/components.tsx';

const TestPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const handlePostProduct = () => {
        console.log("handlePostProduct");
        setLoading(true);
        for (let prod of testProducts){
            request<Product>(config.endpoint.products +'/', 'POST', prod)
                .then((response) => {
                    console.log("product saved", response)
                    setLoading(false);
                })
                .catch((error) => {
                    // handle login error
                    console.log("error", error);
                    setLoading(false);
                });
        }
    }
    const handDeleteAllProduct = () => {
        console.log("handleDeleteAllProduct");
        setLoading(true);
        request<Product>(config.endpoint.products +'/deleteAll', 'DELETE')
        .then((response) => {
            console.log("products deleted", response)
            setLoading(false);
        })
        .catch((error) => {
            // handle login error
            console.log("error", error);
            setLoading(false);
        });
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
                <button onClick={handlePostProduct}>handlePostProduct</button>
                <button onClick={handDeleteAllProduct}>handDeleteAllProduct</button>
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