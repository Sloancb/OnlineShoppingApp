import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { handleAddToCart, cartItem, getCartItemCount, getCartItems, getCartTotalValue, fetchByName, createOrder} from '../API/customerAPI.ts';
import config from '../config.json';
import { Box, TextField, Button, Container, Grid, Menu, FormControl, InputLabel, MenuItem, Select, Typography} from '@mui/material';                // UI component for layout
import { Option } from '@mui/base/Option';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, Product, SearchBar, QuantityInput, CreditCard, sendMessage, Paper, EnsureNotAdmin } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import { useNavigate } from 'react-router-dom';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150, editable:true },
    { field: 'category', headerName: 'Category', width: 150, editable:true },
    { field: 'price', headerName: 'Price', width: 150, editable:true },
    // quantity input 
    { field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      editable: true
      /*
      renderCell: (params) => (
        <Typography>{params.row.quantity}</Typography>
      ),
      */
    },
    // { field: 'quantity',
    //   headerName: 'Quantity',
    //   width: 120,
    //   renderCell: (params) => (
    //     <QuantityInput
    //       row={params.row}
    //       onQuantityChange={(quantity) => {
    //         params.api.updateRows([{ ...params.row, quantity }]); 
    //         // store the updated quantity in the row itself
    //         params.row.quantity = quantity;
    //       }}
    //     />
    //   ),
    // },
    // product image
    { field: 'prodImage',
      type: 'actions',
      headerName: 'Image',
      width: 160,
      getActions: (params) => {
        const imageURL = `${process.env.PUBLIC_URL}/${params.row.image_url}`;
        //const imageURL = `https://via.placeholder.com/50x50/000000/000000`;     // black 50x50 px image
          return [
            <>
              <img
                src={imageURL}        // image from product database
                alt={params.row.name}     // alt image text
                // currently uses name as alt image text. to change that, 
                // add image_alt into cartItem in customerAPI.ts and getCartItemsInfo in cartController.js
                style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '8px'}}
              />
            </>
          ];
      }
    },
    { field: 'Totals',
      width: 160,
      renderCell: (params) => (
        <div 
          style={{ alignItems: 'center', paddingTop: '15px' }}> {/* center in cell */}
          <Typography>{params.row.quantity * params.row.price}</Typography>
        </div>
      )
    }
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
    const [orderId, setOrderId] = useState(0);
    const [orderDate,setOrderDate] = useState('');
    const [orderTotal, setOrderTotal] = useState(0.00);
    const [shipDate, setShipDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const navigate = useNavigate();

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
        console.log('Card Selected :', cardData[paymentIndex as number]);
        if(paymentIndex == -1 ||  !cardData[paymentIndex]) {
          sendMessage("error", "Please select a credit card!");
        } else if (!delivery || delivery == '' || delivery == "None"){
          sendMessage("error", "Please select a Delivery Plan!");
        } 
        else {
          setLoading(true);
          createOrder(delivery, cardData[paymentIndex], data, orderTotal)
          .then((orderData) => {
            try{
              console.log("orderData", orderData);
              setOrderId(orderData.id);
              setOrderDate(orderData.order_date);
              setPageView("confirmation");
              setLoading(false);
            } catch (error) {
              sendMessage("error", "An error has occured! Please try again!");
              console.log("error", error);
              setLoading(false);
            }
            
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
      getCartTotalValue()
      .then((response)=>{
        setOrderTotal(response);
      })
      },[])
    
    useEffect(()=>{
      console.log("Total Amount: ", orderTotal);
    })
    useEffect(()=>{
      if(delivery == "Standard"){
        setShipDate(new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString());
        setDeliveryDate(new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleString());
        console.log("Ship Date: ", shipDate);
        console.log("Delivery Date: ", deliveryDate);
      } else if (delivery == "Express"){
        setShipDate(new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString());
        setDeliveryDate(new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString());
        console.log("Ship Date: ", shipDate);
        console.log("Delivery Date: ", deliveryDate);
      }
      },[delivery])

    useEffect(()=>{
      if(orderId == null || orderDate == null || orderTotal == null || orderId == 0 || orderDate == '' || orderTotal == 0){
        console.log("At least one is null. Please wait... ", orderId, orderDate, orderTotal)
      } else {
        console.log("Everything is Filled!! OrderId:", orderId, " orderDate: ",orderDate, " orderTotal: ", orderTotal)
      }
    },[orderId, orderDate, orderTotal])

        return (
        <EnsureLoggedIn>
          <EnsureNotAdmin>
            <HomeBar>
            <Container maxWidth="lg">
            <>
            {pageView == "checkout" &&
            <>
                <h1>Checkout page</h1>
                <div className="content">
                <div style={{ height: '60vh', width: '100%' }}>
                    <DataGrid
                      rows={data}
                      columns={columns}
                      hideFooter
                      disableRowSelectionOnClick
                  />
                </div>
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
              <div className='container' >
              <h2>Confirmation page</h2>
              <p>Order ID: {orderId}</p>
              <p>Order Date: {orderDate}</p>
              <p>Order Total: {orderTotal}</p>
              <p>Expected Ship Date: {shipDate}</p>
              <p>Expected Delivery Date: {deliveryDate}</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    // Handle button click event
                    navigate('/');
                }}
            >
                Go back to Home
            </Button>
              </div>
            </>
            }
                
            </>
              </Container>
            </HomeBar>
            
          </EnsureNotAdmin>
        </EnsureLoggedIn>
        );
}

export default ProfilePage;