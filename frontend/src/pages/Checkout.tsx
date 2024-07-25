import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { handleAddToCart, cartItem, getCartItemCount, getCartItems} from '../API/customerAPI.ts';
import config from '../config.json';
import { Box, TextField, Button } from '@mui/material';                // UI component for layout
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, Product, SearchBar, QuantityInput } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150, editable:true },
    { field: 'category', headerName: 'Category', width: 150, editable:true },
    { field: 'brand', headerName: 'Brand', width: 150, editable:true },
    { field: 'size', headerName: 'Size', width: 150, editable:true },
    { field: 'description', headerName: 'Description', width: 150, editable:true },
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
  ];

  const ProfilePage: React.FC = () => {
    const [data, setData] = useState<any>();
    const [pageView, setPageView] = useState('checkout');
    //const [data, setData] = useState<Product[]>([]);
    useEffect(()=>{
      try{
          getCartItems()
          .then((response) => {
            setData(response);
        })
        .catch((error) => {
            console.log("error", error);
            // setLoading(false);
        });
          console.log(data);
      }
      catch(error) {
          console.log("error", error);
          // setLoading(false);
      };
    },[data])
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
                    </Box>
                    </div>
                <Button onClick={()=>{setPageView("payment")}}>Click mE1</Button>
            </>
            :
            <>
            {pageView == "payment" ? 
            <>
                <h2>Payment page</h2>
                <Button onClick={()=>{setPageView("confirmation")}}>Click mE1</Button>
            </>
            :
            <h2>Confirmation page</h2>
            }
            </>
                }
            </HomeBar>
        </EnsureLoggedIn>
        );
}

export default ProfilePage;