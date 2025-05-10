import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getProducts } from '../services/api';
import ProductForm from '../components/ProductForm';
import DeleteDialog from '../components/DeleteDialog';
import { AuthContext } from '../context/AuthContext';
import { debounce } from '../utils/debounce';
import { ToastContext } from '../context/ToastContext';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const { data: data } = await getProducts(params);
      setProducts(data.data.products);
    } catch (err) {
      console.error('fetchProducts ~ err):', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const debouncedSearch = debounce((value) => {
    fetchProducts({ search: value, category });
  }, 500);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchProducts({ search, category: e.target.value });
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 350 },
    { field: 'productCode', headerName: 'Product Code', width: 120 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'manufactureDate', headerName: 'Manufacture Date', width: 250 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 250 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant={user.role !== 'superuser' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => {
              if (user.role === 'superuser') {
                setSelectedProduct(params.row);
                setOpenForm(true);
              } else {
                showToast(
                  'You do not have permission to edit this product',
                  'error'
                );
              }
            }}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant={user.role !== 'superuser' ? 'contained' : 'outlined'}
            color="error"
            size="small"
            onClick={() => {
              if (user.role === 'superuser') {
                setSelectedProduct(params.row);
                setOpenDelete(true);
              } else {
                showToast(
                  'You do not have permission to delete this product',
                  'error'
                );
              }
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by name"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
        />
        <TextField
          label="Search by name"
          value={category}
          onChange={handleCategoryChange}
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Add Product
        </Button>
        <Button variant="contained" onClick={() => logout()}>
          Logout
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
          autoHeight
        />
      )}
      <ProductForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={() => fetchProducts({ search, category })}
      />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        productId={selectedProduct?._id}
        onSuccess={() => fetchProducts({ search, category })}
      />
    </Box>
  );
};

export default Dashboard;
