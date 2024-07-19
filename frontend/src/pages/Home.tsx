import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import config from '../config.json';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { EnsureLoggedIn } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import { Product } from '../API/productAPI.ts';

const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'description', headerName: 'Description'},
    { field: 'price', headerName: 'Price', width: 150 },
  ];
const Home: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    useEffect(() => {
      request<Product[]>(config.endpoint.products + '/', 'GET')
      .then((response) => {
        setData(response);
      })
      .catch((error)=>{
        console.log(error)
        setData([]);
        //TODO tell user no prods were found?
      })
      
    }, []);
    const handleProcessRowUpdate = (updatedRow, originalRow) => {
      request<Product>(config.endpoint.products +'/', 'POST', updatedRow)
      .then((response) => {
          console.log("product saved", response)
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
        <div >
          <EnsureLoggedIn>
          <HomeBar>
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
                      processRowUpdate={handleProcessRowUpdate}
                      checkboxSelection
                      disableRowSelectionOnClick
                  />
                </Box>
            </div>
            </HomeBar>
            </EnsureLoggedIn>
        </div>
    );
};
export default Home;