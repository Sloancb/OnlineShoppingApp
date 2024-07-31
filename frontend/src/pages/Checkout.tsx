import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { handleAddToCart, cartItem, getCartItemCount, getCartItems, fetchByName, createOrder} from '../API/customerAPI.ts';
import config from '../config.json';
import { Box, TextField, Button, Container, Grid, Menu, FormControl, InputLabel, MenuItem, Select} from '@mui/material';                // UI component for layout
import { Option } from '@mui/base/Option';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, Product, SearchBar, QuantityInput, CreditCard, sendMessage, Paper } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150, editable:true },
    { field: 'category', headerName: 'Category', width: 150, editable:true },
    { field: 'price', headerName: 'Price', width: 150, editable:true },
    // quantity input 
    { field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      renderCell: (params) => (
        <QuantityInput
          row={params.row}
          onQuantityChange={(quantity) => {
            params.api.updateRows([{ ...params.row, quantity }]); 
            // store the updated quantity in the row itself
            params.row.quantity = quantity;
          }}
        />
      ),
    },
    // add to cart button
    { field: 'prodImage',
      type: 'actions',
      width: 200,
      getActions: (params: GridRowParams<Product>) => {
        //const imageURL = `${process.env.PUBLIC_URL}/${params.row.image_url}`;
        const imageURL = `https://via.placeholder.com/50x50/000000/000000`;
          return [
            <>
            <img
                src={imageURL} // image from product database
                alt={params.row.image_alt} // alt text from product database
                style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '8px'}}
            />
        </>
      ];
      }
    },
    { field: 'addToCart',
      type: 'actions',
      width: 200,
      getActions: (params: GridRowParams<Product>) => {
        return [
        <Button 
          variant="text" 
          startIcon={<ShoppingCartRounded />} 
          onClick={() => handleAddToCart(params.row, params.row.quantity || 1)}
        > Add to Cart
        </Button>];
      }
    },
    { field: 'Total'}
  ];

  const ProfilePage: React.FC = () => {
    const [data, setData] = useState<any>();
    const [pageView, setPageView] = useState<'checkout' | 'payment' | 'confirmation'>('checkout');
    const [cardData, setCardData] = useState<CreditCard[]>([]);
    const [address, setAddress] = useState('');
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentIndex,setPaymentIndex] = useState<number>();
    const [delivery,setDelivery] = useState<string>();
    //const [data, setData] = useState<Product[]>([]);

    const HandleCustomerFetchByName = () => {
      setLoading(true);
      let name1 = window.sessionStorage.getItem('user');
      console.log("name1", name1);
      fetchByName(name1)
      .then((customerData) => {
          console.log("customerData", customerData);
          //setName(customerData.customer.name);
          //setEmail(customerData.customer.email);
          setAddress(customerData.address.address);
          setCardData(customerData.creditCards);
          setLoading(false);
      })
      .catch((error) => {
          console.log("error", error);
          setLoading(false);
      });
      
      
    }

    const CreateOrder = () => {
      setLoading(true);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try{
        console.log('Delivery Selected: ', delivery)
        console.log('Card Selected :', paymentIndex);
        // console.log('Card Selected :', cardData[paymentIndex as number]);
        if(paymentIndex == -1){
          sendMessage("error", "Please select a credit card!");
        } else if (delivery == '' || delivery == "None"){
          sendMessage("error", "Please select a Delivery Plan!");
        } 
        else {
          setLoading(true);
          createOrder(delivery, cardData[paymentIndex], data)
          .then((orderData) => {
            console.log("orderData", orderData);
            setPageView("confirmation");
            setLoading(false);
          })
          .catch((error) => {
              sendMessage("error", error);
              console.log("error", error);
              setLoading(false);
          });
          
        }
        
      } catch (error){
        sendMessage("error", error);
      }
      

    }
    useEffect(()=>{
      try{
          getCartItems()
          .then((response) => {
            setData(response);
        })
        .catch((error) => {
            console.log("error", error);
            setLoading(false);
        });
          console.log(data);
      }
      catch(error) {
          console.log("error", error);
          setLoading(false);
      };
    },[])

    useEffect(()=>{
      HandleCustomerFetchByName();
      },[])

        return (
        <EnsureLoggedIn>
            <HomeBar>
            <Container maxWidth="md">
            <>
            {pageView == "checkout" &&
            <>
                <h1>Checkout page</h1>
                <div className="content">
                  <DataGrid
                    rows={data}
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
                    checkboxSelection
                    disableRowSelectionOnClick
                />
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                > 
                  <Grid item xs>
                    {/* <Button onClick={()=>{setPageView("payment")}}>Go Back</Button> */}
                  </Grid>
                  <Grid>
                    <Button onClick={()=>{setPageView("payment")}}>Continue to Checkout</Button>
                  </Grid>
                </Grid>
              </div>
            </>
          }
            {pageView == "payment" &&
            <>
                <h2>Payment page</h2>
                <div className="content">
                <form onSubmit={handleSubmit}>
                  <h4>Payment Card</h4>
                  <FormControl fullWidth>
                    <InputLabel>Select a Card</InputLabel>
                    <Select
                          value={paymentIndex}
                          label={'Select a Card'}
                          onChange={(event, value) => { if(value){ console.log(value.props.value); setPaymentIndex(value.props.value)} }}
                          fullWidth
                        >
                          <MenuItem value={-1}>None</MenuItem>
                          {cardData.map((card,index) => {
                            return <MenuItem value={index}>{card.card_number}</MenuItem>
                          })}
                    </Select>
                  </FormControl>
                  <h4>Delivery Plan</h4>
                  <FormControl fullWidth>
                    <InputLabel id='payment'>Select a Delivery Plan</InputLabel>
                    <Select
                        value={delivery}
                        label={'Select a Delivery Plan'}
                        onChange={(event, value) => { if(value){ console.log(value.props.value); setDelivery(value.props.value)} }}
                        fullWidth
                      >
                        <MenuItem value={"None"}>None</MenuItem>
                        <MenuItem value={"Standard"}>Standard: $4.99</MenuItem>
                        <MenuItem value={"Express"}>Express: $9.99</MenuItem>
                      </Select>
                      </FormControl>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                    > 
                      <Grid item xs>
                        <Button onClick={()=>{setPageView("checkout")}}>Go Back</Button>
                      </Grid>
                      <Grid>
                        <Button type = "submit">Confirm Order</Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </>
            }
            {pageView == "confirmation" &&
              <>
              <h2>Confirmation page</h2>
              </>
            }
                
            </>
              </Container>
            </HomeBar>
        </EnsureLoggedIn>
        );
}

export default ProfilePage;