import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { handleAddToCart, cartItem, getCartItemCount, getCartItems, getCartTotalValue, fetchByName, createOrder} from '../API/customerAPI.ts';
import config from '../config.json';
import { Box, TextField, Button} from '@mui/material';                // UI component for layout
import { Select } from '@mui/base/Select';
import { Option } from '@mui/base/Option';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, Product, SearchBar, QuantityInput, CreditCard, sendMessage } from '../styling/components.tsx'
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
    { field: 'actions',
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
        <Button 
          variant="text" 
          startIcon={<ShoppingCartRounded />} 
          onClick={() => handleAddToCart(params.row, params.row.quantity || 1)}
        > Add to Cart
        </Button>
        </>
      ];
      }
    },
    { field: 'Total'}
  ];

  const ProfilePage: React.FC = () => {
    const [data, setData] = useState<any>();
    const [pageView, setPageView] = useState('checkout');
    const [cardData, setCardData] = useState<CreditCard[]>([]);
    const [address, setAddress] = useState('');
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [payment,setPayment] = useState<CreditCard>();
    const [delivery,setDelivery] = useState('');
    //const [data, setData] = useState<Product[]>([]);
    const [orderId, setOrderId] = useState(0);
    const [orderDate,setOrderDate] = useState('');
    const [orderTotal, setOrderTotal] = useState(0.00);
    const [shipDate, setShipDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

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
        console.log('Card Selected :', payment);
        if(payment == null){
          sendMessage("error", "Please select a credit card!");
        } else if (delivery == '' || delivery == "None"){
          sendMessage("error", "Please select a Delivery Plan!");
        } 
        else {
          setLoading(true);
          createOrder(delivery, payment, data, orderTotal)
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
            <HomeBar>
            {pageView == "checkout" ?
            <>
                <h2>Checkout page</h2>
                <div className="content">
                <Box sx={{ padding:5, maxHeight: 10}}>
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
                    <Button onClick={()=>{setPageView("payment")}}>Check Out</Button>
                    <p>Total Amount: {orderTotal}</p>
                    </Box>
                    
                </div>
                
            </>
            :
            <>
            {pageView == "payment" ? 
            <>
                <h2>Payment page</h2>
                <form onSubmit={handleSubmit}>
                <h4>Payment Card</h4>
                  <Select
                    sx={{ backgroundColor:'grey' }}
                    defaultValue={0}
                    renderValue={(option: SelectOption<number> | null) => {
                      if (option == null || option.value === 0) {
                        return 'Select a Credit Card...';
                      }
                      return `${option.label} (${option.value})`;
                    }}
                    onChange={(event, value)=>setPayment(cardData[value-1])}
                  >
                    <Option value={0}>None</Option>
                    {
                      cardData.map((card, index) => {
                        console.log(card);
                        return <Option value={index+1}>{card.card_number}</Option>
                      })
                    }
                  </Select>
                  <h4>Delivery Plan</h4>
                  <Select
                    sx={{ backgroundColor:'grey' }}
                    defaultValue={"None"}
                    onChange={(event, value) => setDelivery(value)}
                  >
                    <Option value={"None"}>Select a plan:</Option>
                    <Option value={"Standard"}>Standard: $4.99</Option>
                    <Option value={"Express"}>Express: $9.99</Option>
                    
                  </Select>
                  <p>Estimated Ship Date: {shipDate.toLocaleString()}</p>
                  <p>Estimated Delivery Date: {deliveryDate.toLocaleString()}</p>
                  <Button type = "submit">Confirm Order</Button>
                </form>
                
            </>
            :
            <>
              <h2>Confirmation page</h2>
              <p>Order ID: {orderId}</p>
              <p>Order Date: {orderDate}</p>
              <p>Order Total: {orderTotal}</p>
              <p>Ship Date: {shipDate}</p>
              <p>Delivery Date: {deliveryDate}</p>
            </>
            }
            </>
                }
            </HomeBar>
        </EnsureLoggedIn>
        );
}

export default ProfilePage;