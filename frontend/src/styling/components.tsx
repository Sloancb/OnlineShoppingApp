//React
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as React from 'react';
//MaterialUI
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, Snackbar,  TextField,  ToggleButton,  ToggleButtonGroup,  Paper as basePaper } from '@mui/material';
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
import { fetchAllProducts, postProduct, Product } from '../API/productAPI.ts';

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
    if(!jwt || jwt == "undefined" ){
      navigate('/Login')
      sendMessage("warning", "Invalid Persmission!")
    }
  })
  if(jwt)
    return (
      <div>
        {children}
      </div>
    ) 
}
export const EnsureAdmin = ({children}) =>{
  const adminToken = localStorage.getItem("adminToken")
  const navigate = useNavigate();
  React.useEffect(()=>{
    if(!adminToken || adminToken == "undefined" ){
      navigate('/Login')
      sendMessage("warning", "Invalid Persmission!")
    }
  })
  if(adminToken)
    return (
      <div>
        {children}
      </div>
    ) 
}

export const EnsureNotAdmin = ({children}) =>{
  const adminToken = localStorage.getItem("adminToken")
  const navigate = useNavigate();
  React.useEffect(()=>{
    console.log(adminToken)
    if(adminToken || adminToken != "undefined" ){
      navigate('/')
      sendMessage("warning", "Invalid Permission!")
    }
  })
  if(!adminToken || adminToken == "undefined" )
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

//Products
interface ProductFormProps{
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<Product[]>>
}
export const ProductForm = (props:ProductFormProps) =>{
  let {open, setOpen, setData} = props
  let [name, setName] = useState("")
  let [category, setCategory] = useState("")
  let [brand, setBrand] = useState("")
  let [size, setSize] = useState("")
  let [description, setDescription] = useState("")
  let [price, setPrice] = useState<number>(0)
  const handleClose = () => {
    handleDataReset()
    setOpen(false);
  };
  const handleDataReset = () =>{
    setName("")
    setCategory("")
    setBrand("")
    setSize("")
    setDescription("")
    setPrice(0)
  }
  const handleSubmit = async () => {
    await postProduct({id:0, name, category, brand, size, description, price})
    .catch(()=>{
      sendMessage("error", "Product not saved!")
    })
    await fetchAllProducts()
    .then((response)=>{
      setData(response)
    })
    setOpen(false)
    sendMessage("success", "Product saved!")
    handleDataReset()
  }
  return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Create a new Product</DialogTitle>
        <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs ={6}>
            <div className="Form">
                <TextField
                    label="name"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}
                />
            </div>
            <div className="Form">
                <TextField
                    label="category"
                    value={category}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setCategory(event.target.value);
                    }}
                />
            </div>
            <div className="Form">
                <TextField
                    label="brand"
                    type='brand'
                    value={brand}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setBrand(event.target.value);
                    }}
                />
            </div>
          </Grid>
              <Grid item xs ={6}>
              <div className="Form">
                  {/* Add new input fields for the payment billing information */}
                  <TextField
                      label="size"
                      type='size'
                      value={size}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSize(event.target.value);
                      }}
                  />
              </div>
                  <div className="Form">
                      <TextField
                          label="Description"
                          value={description}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDescription(event.target.value);
                          }}
                      />
                  </div>
                  <div className="Form">
                      <TextField
                          label="price"
                          value={price}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setPrice(+event.target.value);
                          }}
                      />
                  </div>
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <div className='align-center'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogActions>
      </Dialog>
  );
}