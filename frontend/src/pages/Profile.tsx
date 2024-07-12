import React, {useState} from 'react';
import config from '../config.json';

import { TextField } from '@mui/material';
import { request } from '../API/Requests.ts';
import HomeBar, { EnsureLoggedIn, sendMessage } from '../styling/components.tsx';

function ProfilePage() {
    
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false)
    const HandleCustomerFetchByName = () => {
        setLoading(true);
        let name1 = window.sessionStorage.getItem('user');
        console.log("name", name)
        request(config.endpoint.customers + '/fetchByName','GET', {name:name1})
            .then((response) => {
                // handle successful GetCustomer
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle GetCustomer error
                console.log("error", error);
                setLoading(false);
            });
    }
    return (
    <EnsureLoggedIn>
        <HomeBar>
            
                <div className="container">
                    <h2>This is the profile page</h2>    
                    <button onClick={HandleCustomerFetchByName}>handleCustomerFetchByName</button>
                    <button onClick={()=>{sendMessage('success', "Test success message")}}>send success message</button>
                    
               
                    <TextField
                        label="Username"
                        value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                    />
                    <TextField
                        label="Email"
                        /*value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(event.target.value);
                        }}*/
                    />
                    <TextField
                        label="Credit Card Number"
                        /*value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}*/
                    />
                    <TextField
                        label="Payment Address"
                        /*value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}*/
                    />
                    <TextField
                        label="Delivery Address"
                        /*value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}*/
                    />
                
                <br/>
                </div>
        </HomeBar>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;