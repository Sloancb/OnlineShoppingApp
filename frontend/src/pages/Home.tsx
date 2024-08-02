import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import { handleAddToCart, cartItem, getCartItemCount } from '../API/customerAPI.ts';
import config from '../config.json';
import { Box, TextField, Button } from '@mui/material';                // UI component for layout
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { EnsureLoggedIn, Product, SearchBar, QuantityInput } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';



function test(row, id){
  console.log("test")
  handleAddToCart(row, id)
}
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150, editable:false },
  { field: 'category', headerName: 'Category', width: 150, editable:false },
  { field: 'brand', headerName: 'Brand', width: 150, editable:false },
  { field: 'size', headerName: 'Size', width: 80, editable:false },
  { field: 'description', headerName: 'Description', width: 220, editable:false },
  { field: 'price', headerName: 'Price', width: 150, editable:false },
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
      const imageURL = `${process.env.PUBLIC_URL}/${params.row.image_url}`;
      //const imageURL = `https://via.placeholder.com/50x50/000000/000000`;     // black 50x50 px image
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
            onClick={() =>{test(params.row, params.row.quantity || 1)}}
          > Add to Cart
          </Button>
      </>
    ];
    }
  },
];



// filters data for search input
function Filter({ input }: SearchBar) {
  // ----- state to hold product data
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    request<Product[]>(config.endpoint.products + '/', 'GET')
    .then((response) => {
      setData(response);              // update state with the fetched data
    }).catch(()=>{
    
    })
  }, []);

  // ----- filter data
	const filteredData = data.filter((el: Product) => {
		if (input === '') {
		  return true;
		} else {
		  return el.name.toLowerCase().includes(input.toLowerCase());
		}
	  });

    // row update event in the data grid
    const handleProcessRowUpdate = (updatedRow, originalRow) => {
      request<Product>(config.endpoint.products + '/', 'POST', updatedRow)
      .then((response) => {
          console.log("product saved", response)
          // refresh the product data after update
          request<Product[]>(config.endpoint.products + '/', 'GET')
          .then((response) => {
            setData(response);
          });
      })
      .catch((error) => {
          console.log("error", error);
          // setLoading(false);
      });
    };

  return (
    <div className="content">
    <Box sx={{ padding:5, maxHeight: 10}}>
    <DataGrid
            rows={filteredData}
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
      </Box>
      </div>
  );
}



const Home: React.FC = () => {
  // ------ searchbar
  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

    return (
        <div >
          <EnsureLoggedIn>
          <HomeBar>
          <div className="main">
          <div className="search">
              <TextField
              id="outlined-basic"
              onChange={inputHandler}
              variant="outlined"
              fullWidth
              label="Search"
            />
          </div>
          <Filter input={inputText} />
            </div>
            </HomeBar>
            </EnsureLoggedIn>
        </div>
    );
};
export default Home;
