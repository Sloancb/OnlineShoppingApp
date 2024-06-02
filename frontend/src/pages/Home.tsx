import * as React from 'react';
import SearchAppBar from './Sidebar.tsx';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 15000000000000 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
const handleProcessRowUpdate = (updatedRow, originalRow) => {
    console.log(updatedRow, originalRow);
    return updatedRow;
  };
const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID'},
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
    //   width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      editable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];
  
const Home: React.FC = () => {
    
    return (
        <div >
            <div className="sidebar">
                <SearchAppBar/>
            </div>
            <div className="content">
            <Box sx={{ padding:5, maxHeight: 10}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                    // pagination: {
                    //     paginationModel: {
                    //     pageSize: 5,
                    //     },
                    // },
                    }}
                    pageSizeOptions={[5]}
                    processRowUpdate={handleProcessRowUpdate}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
                </Box>
            </div>
        </div>
    );
};
export default Home;