import React, {useEffect, useState} from 'react';
import config from '../config.json';

import { TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { request } from '../API/Requests.ts';
import HomeBar, { EnsureLoggedIn, sendMessage, CreditCard } from '../styling/components.tsx';

function ProfilePage() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [cardData, setCardData] = useState<CreditCard[]>([]);
    const [loading, setLoading] = useState(false);

    const HandleCustomerFetchByName = () => {
        setLoading(true);
        let name1 = window.sessionStorage.getItem('user');
        
        request(config.endpoint.customers + '/fetchByName','POST', {name:name1})
            .then((response) => {
                // handle successful GetCustomer
                console.log("response", response)
                setName(response.customer.name);
                setEmail(response.customer.email);
                setAddress(response.address.address);
                setCardData(response.creditCards);
                setLoading(false);
                console.log("cardData", cardData);
            })
            .catch((error) => {
                // handle GetCustomer error
                console.log("error", error);
                setLoading(false);
            });
    }

    const HandleCustomerSubmit = () => {
        setLoading(true);
        let user_id = window.sessionStorage.getItem('id');
        request(config.endpoint.customers + '/update','POST', {customer_id:user_id, name:name, email:email, address:address, creditCards:cardData})
            .then((response) => {
                // handle successful update
                console.log("response", response)
                setLoading(false);
            })
            .catch((error) => {
                // handle update error
                console.log("error", error);
                setLoading(false);
            });
    }

    useEffect(()=>{
        HandleCustomerFetchByName();
    },[])

    const columns: GridColDef<CreditCard>[] = [
        { field: 'card_number', headerName: 'Card Number', width: 150, editable:true },
        { field: 'billing_address', headerName: 'Payment Address', width: 150, editable:true },
        { field: 'expiry_date', headerName: 'Expiration Date', width: 150, editable:true },
    ];

    const handleProcessRowUpdate = (updatedRow, originalRow) => {
    };

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
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        label="Delivery Address"
                        value={address}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddress(event.target.value);
                        }}
                    />
                    <DataGrid
                      rows={cardData}
                      columns={columns}
                      autoHeight
                      initialState={{
                      pagination: {
                          paginationModel: {
                          pageSize: 10,
                          },
                      },
                      }}
                      pageSizeOptions={[5]}
                      processRowUpdate={handleProcessRowUpdate}
                      checkboxSelection
                      disableRowSelectionOnClick
                  />

                    <button onClick={HandleCustomerSubmit}>Submit Changes</button>
                <br/>
                </div>
        </HomeBar>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;