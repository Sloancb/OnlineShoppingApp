import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import config from '../config.json';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchAppBar, { EnsureLoggedIn, HandleMessages, Product } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';


const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Name', width: 150, editable:true },
    { field: 'category', headerName: 'Category', width: 150, editable:true },
    { field: 'brand', headerName: 'Brand', width: 150, editable:true },
    { field: 'size', headerName: 'Size', width: 150, editable:true },
    { field: 'description', headerName: 'Description', width: 150, editable:true },
    { field: 'price', headerName: 'Price', width: 150, editable:true },
  ];

const Home: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    useEffect(() => {
      request<Product[]>(config.endpoint.products + '/', 'GET')
      .then((response) => {
        setData(response);
      });
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
      console.log(data)
      console.log(updatedRow)
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