import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
import { format } from 'date-fns';

const ProductTable = ({ products, onEdit, onDelete, page, total, onPageChange }) => {
  // Define columns for DataGrid
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'productCode', headerName: 'Product Code', width: 120 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'manufactureDate',
      headerName: 'Manufacture Date',
      width: 150,
      valueFormatter: (params) =>
        format(new Date(params.value), 'MM/dd/yyyy'),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: (params) =>
        format(new Date(params.value), 'MM/dd/yyyy'),
    },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 150,
      valueGetter: (params) => params.value.name,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Map products to DataGrid rows
  const rows = products.map((product) => ({
    _id: product._id,
    name: product.name,
    productCode: product.productCode,
    price: product.price,
    category: product.category,
    manufactureDate: product.manufactureDate,
    expiryDate: product.expiryDate,
    status: product.status,
    owner: product.owner,
    image: product.image,
  }));

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {products.length === 0 ? (
        <Typography variant="body1" align="center">
          No products available.
        </Typography>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
          page={page - 1} // DataGrid uses 0-based index
          rowCount={total}
          paginationMode="server"
          onPageChange={(newPage) => onPageChange(newPage + 1)} // Convert back to 1-based index
          getRowId={(row) => row._id}
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': {
              py: 1,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      )}
    </Box>
  );
};

export default ProductTable;