import React, { useEffect, useState } from 'react';
import { request } from '../API/Requests.ts';
import config from '../config.json';
import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { EnsureAdmin, EnsureLoggedIn, ProductForm, sendMessage } from '../styling/components.tsx'
import HomeBar from '../styling/components.tsx';
import { editProduct, fetchAllProducts, handDeleteProduct, Product } from '../API/productAPI.ts';
import { delay, isEqual } from '../styling/support.ts';


const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'id', width: 120, editable:false},
    { field: 'name', headerName: 'Name', width: 120, editable:true},
    { field: 'category', headerName: 'Category', width: 80, editable:true },
    { field: 'brand', headerName: 'Brand', width: 80, editable:true },
    { field: 'size', headerName: 'Size', width: 80, editable:true },
    { field: 'description', headerName: 'Description',width: 400, editable:true },
    { field: 'price', headerName: 'Price', editable:true },
    {field: 'delete',
    headerName: 'delete',
    renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Delete
        </Button>
    ),
  },
  ];

const StaffHome: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    const [productFormOpen, setProductFormOpen] = useState(false)
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    
    useEffect(() => {
      fetchAllProducts()
      .then((prodData)=>{
        setData([...prodData])
      })
    }, []);

    const handleProcessRowUpdate = (updatedRow, originalRow) => {
      if(!isEqual(updatedRow, originalRow)){
        editProduct(updatedRow)
        .then(()=>{
          fetchAllProducts()
          .then((data)=>{
            setData([...data])
          })
        })
      }
    };
    const [alignment, setAlignment] = React.useState('product');
    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
    ) => {
      setAlignment(newAlignment);
    };
    const handleDelete =async () =>{
      if (rowSelectionModel.length == 0) {
        return
      }
      for (let id of rowSelectionModel){
        await handDeleteProduct(id)
          .catch(()=>{
            sendMessage("error", "failed to delete Product:" + id)
            return 
          })
      }
      await delay(10)
      await fetchAllProducts()
        .then((data)=>{
          setData([...data])
        })
    }
    return (
      <div >
        <EnsureLoggedIn>
          <EnsureAdmin>
          <HomeBar>
              <Box sx={{ padding:5, maxHeight: 10}}>
                <div style={{marginBottom:"2vh", marginTop:0}}>
                  <ToggleButtonGroup
                    color="primary"
                    size='small'
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                  >
                    <ToggleButton value="product">Products</ToggleButton>
                    <ToggleButton value="warehouse">Warehouses</ToggleButton>
                  </ToggleButtonGroup>
                </div>
                  {alignment == 'product' ?
                  <div>
                  <Button onClick={handleDelete}>Delete Product</Button>
                  <Button onClick={()=>{setProductFormOpen(true)}}>Add Product</Button>
                  <DataGrid
                      rows={data}
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
                  </div>
                  :
                  <Button> 
                    THis is here
                  </Button>
                }
              </Box>
            <ProductForm open={productFormOpen} setOpen={setProductFormOpen} setData={setData}/>
          </HomeBar>
          </EnsureAdmin>
        </EnsureLoggedIn>
      </div>
    );
};
export default StaffHome;