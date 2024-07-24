//React
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as React from 'react';
//MaterialUI
import { Alert, Menu, MenuItem, Snackbar, TextField,  Paper as basePaper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
//Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {HandleLogout} from '../API/customerAPI.ts';
//API
import { getCartItemCount } from '../API/customerAPI.ts';

// Home bar
export default function HomeBar({children}) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>{navigate('/Profile')}}> My account</MenuItem>
        <MenuItem onClick={()=>{HandleLogout(navigate)}}>Logout</MenuItem>
      </Menu>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={0} alignItems="center">
              <Grid item xs={0}>
                  <IconButton onClick={()=>{navigate('/')}}>
                    <HomeIcon fontSize ={"large"}/>
                  </IconButton>
              </Grid>
              <Grid item xs = {5} >
                  <h3>Some Cool App Name</h3>
              </Grid>
              <Grid  item xs>
                  <div style ={{textAlign:'right'}}>
                    <IconButton onClick={()=>{navigate('/Checkout')}}>
                    <CartBadge />
                    </IconButton>
                    <IconButton id='Account-button' onClick={handleMenu}>
                      <PersonIcon fontSize ={"large"}/>
                    </IconButton>
                  </div>
              </Grid>
            </Grid>
        </Toolbar>
      </AppBar>

    {children}
    </div>
  );
}

// shopping cart badge
const CartBadge = () => {
  const [itemCount, setItemCount] = useState(0);
  useEffect(() => {
      const fetchCartItemCount = async () => {
          try {
              const count = await getCartItemCount();
              if (count !== -1) {
                  setItemCount(count);
              } else {
                  sendMessage('error', "Failed to fetch cart item count");
              }
          } catch (error) {
              sendMessage('error', `Error: ${error.message}`);
              console.error("Error fetching cart item count:", error);
          }
      };

      fetchCartItemCount();
  }, []);

  return (
      <Badge badgeContent={itemCount} color="secondary">
          <ShoppingCartIcon  fontSize ={"large"}/>
      </Badge>
  );
};

//paper
export const Paper = styled(basePaper)(({ theme }) => ({
    padding: theme.spacing(2),
    elevation: 10,
    ...theme.typography.body2,
    textAlign: 'center', 
  }));

// handle Login
export const EnsureLoggedIn = ({children}) =>{
  const jwt = localStorage.getItem("jwt")
  const navigate = useNavigate();
  React.useEffect(()=>{
    if(!jwt){
      navigate('/Login')
    }
  })
  if(jwt)
    return (
      <div>
        {children}
      </div>
    ) 
}

//Message Handler
export interface message{
  exists: boolean,
  type: "success" | "info" | "warning" | "error",
  message: string
}
export const sendMessage = (type : "success" | "info" | "warning" | "error", message:string) => {
  let messageObj : message = {exists: true, type:type, message:message}
  window.sessionStorage.setItem('msg', JSON.stringify(messageObj))
  window.dispatchEvent(new Event("storage"));
};

export const HandleMessages = ({children}:any) =>{
  const nullMessage : message= {exists:false, type:"error", message: ""}
  const [message, setMessage] = useState<message>(nullMessage)

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) =>{
    if (reason === 'clickaway') {
      return;
    }
    setMessage({...message, exists:false}) //The alert will switch before the snackbar leaves the page. So we must leave the the type consistent so the alert doesn't refresh
    sessionStorage.removeItem('msg')
  }
  //TODO: add a level messages system
  window.onstorage = (ev) => {
    console.log("storage listener activated")
    let msgStr = sessionStorage.getItem('msg')
    if(msgStr) {
      let msg : message = JSON.parse(msgStr)
      console.log("message",msgStr )
      setMessage(msg)
    } 
  }
  return (
    <div>
      {children}
      <Snackbar
        open={message.exists}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={message.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

// quantity input field
export function QuantityInput({ row, onQuantityChange }: { row: Product, onQuantityChange: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(row.quantity || 1);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10) || 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <TextField
      id="outlined-basic"
      label=""
      variant="outlined"
      type="number"
      InputProps={{ inputProps: { min: 1 } }}
      value={quantity}
      onChange={handleChange}
    />
  );
}



// interfaces
export interface Product {
  id : number,
  name: string,
  category: string,
  brand: string,
  size: string,
  description: string,
  price: number,
  quantity: number,
  image_url: string,
  image_alt: string
}

export interface SearchBar {
  input: string
}

export interface Cart {
  customer_id : number,
  total_price: number
}

export const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

