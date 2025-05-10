import { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { deleteProduct } from '../services/api';
import { ToastContext } from '../context/ToastContext';
const DeleteDialog = ({ open, onClose, productId, onSuccess }) => {
  const { showToast } = useContext(ToastContext);
  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      onSuccess();
    } catch (err) {
      console.log('🚀 ~ handleDelete ~ err:', err.response.data.error);
      showToast(err.response.data.error, 'error');
      console.error(err);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this product?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
