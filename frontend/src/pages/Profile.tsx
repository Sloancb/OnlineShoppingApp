import React, {useEffect, useState} from 'react';

import { TextField, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import HomeBar, { EnsureLoggedIn, sendMessage, CreditCard, CreditCardForm, EnsureNotAdmin } from '../styling/components.tsx';
import { isEqual } from '../styling/support.ts';
import {fetchByName, updateCustomer } from '../API/customerAPI.ts';

function ProfilePage() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [cardData, setCardData] = useState<CreditCard[]>([]);
    /*const [newCardNumber, setNewCardNumber] = useState('');
    const [newBillingAddress, setNewBillingAddress] = useState('');
    const [newExpiryDate, setNewExpiryDate] = useState('');*/
    const [creditCardFormOpen, setCreditCardFormOpen] = useState(false)
    const [loading, setLoading] = useState(false);

    const HandleCustomerFetchByName = () => {
        setLoading(true);
        let name1 = window.sessionStorage.getItem('user');
        console.log("name1", name1);
        fetchByName(name1)
        .then((customerData) => {
            console.log("customerData", customerData);
            setName(customerData.customer.name);
            setEmail(customerData.customer.email);
            setAddress(customerData.address.address);
            setCardData(customerData.creditCards);
            setLoading(false);
        })
        .catch((error) => {
            console.log("error", error);
            setLoading(false);
        });
        
    }

    const HandleCustomerSubmit = () => {
        setLoading(true);
        let user_id = window.sessionStorage.getItem('id');
        updateCustomer(user_id, name, email, address, cardData)
        .then((response) => {
            console.log("response", response);
            setLoading(false);
            HandleCustomerFetchByName();
        })
        
    }

    const handleDeleteCard = (card_id) => {
        setLoading(true);
        let updatedCardData = cardData.filter((card) => card.id !== card_id);
        console.log("updatedCardData", updatedCardData);
        setCardData(updatedCardData);
        setLoading(false);
        updateCustomer(window.sessionStorage.getItem('id'), name, email, address, updatedCardData)
    }

    useEffect(()=>{
        HandleCustomerFetchByName();
    },[])

    const columns: GridColDef<CreditCard>[] = [
        { field: 'card_number', headerName: 'Card Number', width: 150, editable:true },
        { field: 'billing_address', headerName: 'Payment Address', width: 150, editable:true },
        { field: 'expiry_date', headerName: 'Expiration Date', width: 150, editable:true },
        {field: 'delete',
            headerName: 'Delete',
            renderCell: (params: GridRenderCellParams<any, Date>) => (
                <Button
                  variant="contained"
                  size="small"
                  tabIndex={params.hasFocus ? 0 : -1}
                  onClick={() => {
                    handleDeleteCard(params.row.id);
                  }}
                >
                  Delete
                </Button>
            ),
        },
    ];

    const handleProcessRowUpdate = (updatedRow, originalRow) => {
        if(!isEqual(updatedRow, originalRow)){
            let updatedCardData: any[] = []; 
            for (let i = 0; i < cardData.length; i++) {
                if (cardData[i].id === originalRow.id) {
                    updatedCardData[i] = updatedRow;
                }
                else{
                    updatedCardData[i] = cardData[i];
                
                }
            }
            setCardData(updatedCardData);
            console.log("updatedCardData", cardData);
        }
        return updatedRow;
    };

    /*
    const HandleAddCard = () => {
        let user_id = window.sessionStorage.getItem('id');
        createCreditCard(user_id, newCardNumber, newBillingAddress, newExpiryDate)
        .then((response) => {
            console.log("response", response);
            HandleCustomerFetchByName();
        })
    };
    */

    return (
    <EnsureLoggedIn>
        <EnsureNotAdmin>
        <HomeBar>
            
                <div className="container">
                    <div>
                    <h2>Edit Account</h2>

                    {/*<Button onClick={HandleCustomerFetchByName}>handleCustomerFetchByName</Button>
                    <Button onClick={()=>{sendMessage('success', "Test success message")}}>send success message</Button>*/}
                    <Button onClick={()=>{setCreditCardFormOpen(true)}}>Add Credit Card</Button>
                    <CreditCardForm open={creditCardFormOpen} setOpen={setCreditCardFormOpen} updateData={HandleCustomerFetchByName}/>
                    <br/>
                    <br/>
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
                      onProcessRowUpdateError={(error) => {console.log("error", error)}}
                      //checkboxSelection
                      disableRowSelectionOnClick
                  />

                    <Button onClick={HandleCustomerSubmit}>Submit Changes</Button>
                    </div>

                    {/*}
                    <div>
                        <h2>Add a Credit Card</h2>
                        <TextField
                            label="Card Number"
                            value={newCardNumber}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewCardNumber(event.target.value);
                            }}
                        />
                        <TextField
                            label="Billing Address"
                            value={newBillingAddress}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewBillingAddress(event.target.value);
                            }}
                        />
                        <TextField
                            label="Expiration Date"
                            value={newExpiryDate}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewExpiryDate(event.target.value);
                            }}
                        />
                        <Button onClick={HandleAddCard}>Add Card</Button>
                    </div>
                    */}
                <br/>
                </div>
        </HomeBar>
        </EnsureNotAdmin>
    </EnsureLoggedIn>
    );
}

export default ProfilePage;