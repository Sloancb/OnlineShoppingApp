//React
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
//MaterialUI
import { Alert, Button, Card, CardContent, CircularProgress, Menu, MenuItem, Snackbar, TextField, Paper as basePaper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
//Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {HandleLogout} from '../API/customerAPI.ts';

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
                      <Badge  badgeContent={4} color="secondary">
                        <ShoppingCartIcon  fontSize ={"large"}/>
                      </Badge>
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
export const HandleMessages = ({children}) =>{
  const nullMessage : message= {exists:false, type:"error", message: ""}
  const [message, setMessage] = useState<message>(nullMessage)

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) =>{
    sessionStorage.removeItem('msg')
    if (reason === 'clickaway') {
      return;
    }
    setMessage(nullMessage)
  }
  const msgStr = sessionStorage.getItem('msg')
  if(msgStr && !message.exists) {
    let msg : message = JSON.parse(msgStr)
    setMessage(msg)
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
// interfaces
export interface error {
    isError: boolean,
    message: string
}

export interface Product {
  id : number,
  name: string,
  category: string,
  brand: string,
  size: string,
  description: string,
  price: number
}

export const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);