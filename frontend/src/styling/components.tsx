//React
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as React from 'react';
//MaterialUI
import { fetchAllWarehouses, Warehouse } from '../API/warehouseAPI.ts';
//MaterialUI
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, Snackbar,  TextField,  ToggleButton,  ToggleButtonGroup,  Typography,  Paper as basePaper } from '@mui/material';
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
import {createCreditCard, HandleLogout, getCartItemCount} from '../API/customerAPI.ts';
import { editProduct, fetchAllProducts, postProduct } from '../API/productAPI.ts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addStock, editStock, fetchStock, Stock } from '../API/stockAPI.ts';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { promises } from 'dns';
import { useTheme } from '@emotion/react';
import { isEqual } from './support.ts';

// Home bar
export default function HomeBar({children}) {
  const navigate = useNavigate()
  const adminToken = localStorage.getItem("adminToken")
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
        {!adminToken && <MenuItem onClick={()=>{navigate('/Profile')}}> My account</MenuItem>}
        <MenuItem onClick={()=>{HandleLogout(navigate)}}>Logout</MenuItem>
        {adminToken && adminToken != "undefined" && <MenuItem onClick={()=>{navigate('/staff')}}>Staff Page</MenuItem> }
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
                  {!adminToken && <IconButton onClick={()=>{navigate('/Checkout')}}>
                      <CartBadge />
                    </IconButton>}
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
  const fetchCartItemCount = async () => {
    console.log("fetching cart")
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
    window.addEventListener('updateCart', (e)=>(fetchCartItemCount()), {once:true});  
};  

  useEffect(()=>{
    console.log("called twice")
    fetchCartItemCount();
  },[])

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
    if(adminToken && adminToken != "undefined" ){
      navigate('/')
      sendMessage("warning", "Invalid Permission!")
    }
  })
  if(!adminToken || adminToken == "undefined"  )
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

export interface CreditCard {
  id: number,
  cardNumber: string,
  expiryDate: string,
  paymentAddress: string
}

interface CreditCardFormProps{
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
  updateData: React.Dispatch<React.SetStateAction<CreditCard[]>>
}
export const CreditCardForm = (props:CreditCardFormProps) =>{
  let {open, setOpen, updateData} = props
  let [newNumber, setNewNumber] = useState("")
  let [newBillingAddress, setNewBillingAddress] = useState("")
  let [newExpiryDate, setNewExpiryDate] = useState("")
  const handleClose = () => {
    handleDataReset()
    setOpen(false);
  };
  const handleDataReset = () =>{
    setNewNumber("")
    setNewBillingAddress("")
    setNewExpiryDate("")
  }
  const handleSubmit = async () => {
    let user_id = window.sessionStorage.getItem('id');
    await createCreditCard(user_id, newNumber, newBillingAddress, newExpiryDate)
    .catch(()=>{
      sendMessage("error", "Credit Card not saved!")
    })
    setOpen(false)
    sendMessage("success", "Credit Card saved!")
    handleDataReset()
    updateData()
  }
  return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Create a new Credit Card</DialogTitle>
        <DialogContent>
        <Grid container spacing={0}>
          <Grid item xs ={10}>
            <div className="Form">
                <TextField
                    label="Number"
                    value={newNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setNewNumber(event.target.value);
                    }}
                />
            </div>
            <div className="Form">
                <TextField
                    label="Billing Address"
                    value={newBillingAddress}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setNewBillingAddress(event.target.value);
                    }}
                />
            </div>
            <div className="Form">
                <TextField
              
                    helperText="Exipration Date"
                    type='date'
                    value={newExpiryDate}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setNewExpiryDate(event.target.value);
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
interface AddProductToWareHouseProps {
  warehouse : Warehouse
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  updateWarehouses:  () => void
}
export const AddProductToWareHouse = (props:AddProductToWareHouseProps)=>{
  const {warehouse, open, setOpen, updateWarehouses} = props
  const [products, setProducts] = useState<Product[]>([])

  const [pageView, setPageView] = useState<"product" | "quantity">("product")
  const [productId, setProductId] = useState(-1)
  const [quantity, setQuantity] = useState(0)

  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const handleRowSelection = (newRowSelectionModel: GridRowSelectionModel) =>{
    let a :any = newRowSelectionModel
    setRowSelectionModel(a[a.length-1])
    setProductId(a[0])
  }
  const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'id', width: 120, editable:false},
    { field: 'name', headerName: 'Name', width: 120, editable:false},
    { field: 'category', headerName: 'Category', width: 80, editable:false },
    { field: 'brand', headerName: 'Brand', width: 80, editable:true },
    { field: 'size', headerName: 'Size', width: 80, editable:false },
    { field: 'description', headerName: 'Description',width: 700, editable:false },
    { field: 'price', headerName: 'Price', editable:false },
  ];

  const handleClose = () => {
    setOpen(false);
    setProductId(-1)
    setQuantity(0)
    setRowSelectionModel([])
    updateWarehouses()
    setPageView('product')
  };
  const handleSubmit = () =>{
    addStock(productId, warehouse.id, quantity)
    .then(()=>{
      handleClose()
    })
  }
  useEffect(() => {
      fetchAllProducts()
      .then((prodData)=>{
        setProducts([...prodData])
      })
  }, []);
  return (
    <Dialog
      maxWidth={'xl'}
      fullWidth={false}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        Select a product to add to the warehouse
        <br/>
        { pageView == "product" ? 
      <DataGrid
            rows={products}
            columns={columns}
            autoHeight
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 6,
                },
            },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            }}
            pageSizeOptions={[5]}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              handleRowSelection(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
            disableRowSelectionOnClick
            disableMultipleRowSelection
        />
        :
        <div className="Form">
          <TextField
              label="Quantity"
              value={quantity}
              type={'number'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuantity(+event.target.value);
              }}
          />
      </div>
          }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        { pageView == "product" ? <Button onClick={()=>{setPageView('quantity')}}>Add Quantity</Button> : <Button onClick={handleSubmit}>Submit</Button>}
      </DialogActions>
    </Dialog>
  )
}
interface warehouseAccordionProps{
  warehouse:Warehouse
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
}
export const WarehouseAccordion = (props:warehouseAccordionProps) =>{
  const {warehouse, setWarehouses} = props
  const [stocks, setStocks] = useState<Stock[]>([])
  const [expanded, setExpanded] = useState(false)
  const [openAddProduct, setOpenAddProduct] = useState(false)

  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const updateWarehouse = () =>{
    fetchAllWarehouses()
    .then((warehouses)=>{
      setWarehouses([...warehouses])
    })
  }
  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    if(!isEqual(updatedRow, originalRow)){
      console.log(updatedRow)
      if(!isEqual(updatedRow, originalRow))
        editStock(originalRow.productId, originalRow.warehouseId, updatedRow.quantity)
        .then(()=>{
          fetchStock(warehouse.id)
          .then((stocks)=>{
            setStocks([...stocks])
            updateWarehouse()
          })
        })
    }
  };
  const columns: GridColDef<Stock>[] = [
    { field: 'productId', headerName: 'Product Id', width: 120, editable:false},
    { field: 'name', headerName: 'Name', width: 120, editable:false},
    { field: 'description', headerName: 'Description', width: 1000, editable:false},
    { field: 'quantity', headerName: 'quantity', width: 80, editable:true },

  ];

  
  const  handleChange =  (warehouse:Warehouse) =>  (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (event.target["nodeName"] == "BUTTON")
      return
    if(!expanded){
      fetchStock(warehouse.id)
      .then((stocks)=>{
        setStocks([...stocks])
      })
      setExpanded(true)
    }
    else {
      setStocks([])
      setExpanded(false)
    }
  };
  return (
    <>
    <AddProductToWareHouse
      warehouse={warehouse}
      open={openAddProduct}
      setOpen={setOpenAddProduct}
      updateWarehouses={updateWarehouse}
    />
    <Accordion expanded={expanded} onChange={handleChange(warehouse)}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>
            ID:{warehouse.id} - Address:{warehouse.address} - Capacity: {warehouse.currentCapacity}/{warehouse.capacity}
            <Button onClick={()=>{setOpenAddProduct(true)}}>Add Product</Button>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid
            rows={stocks.map((stock)=>{
              let stockId = stock.productId
              return {...stock, id:stockId,}
            })}
            columns={columns}
            autoHeight
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 6,
                },
            },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            }}
            pageSizeOptions={[5]}
            processRowUpdate={handleProcessRowUpdate}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
            disableRowSelectionOnClick
        />
        </AccordionDetails>
    </Accordion>
    </>
  )
}
