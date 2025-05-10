import { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct } from '../services/api';
import { ToastContext } from '../context/ToastContext';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  productCode: Yup.string().required('Required'),
  price: Yup.number().positive('Must be positive').required('Required'),
  category: Yup.string().required('Required'),
  manufactureDate: Yup.date().required('Required').typeError('Invalid date'),
  expiryDate: Yup.date()
    .required('Required')
    .typeError('Invalid date')
    .min(
      Yup.ref('manufactureDate'),
      'Expiry date must be after manufacture date'
    ),
  // Image is optional, so no validation is required
});

const ProductForm = ({ open, onClose, product, onSuccess }) => {
  // State for file input (not managed by Formik)
  const [image, setImage] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const { showToast } = useContext(ToastContext);

  // Initial form values
  const initialValues = {
    name: product?.name || '',
    productCode: product?.productCode || '',
    price: product?.price || '',
    category: product?.category || '',
    manufactureDate: product?.manufactureDate?.split('T')[0] || '',
    expiryDate: product?.expiryDate?.split('T')[0] || '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitError(''); // Clear previous errors
    const formData = new FormData();
    // Append text fields
    Object.keys(values).forEach((key) => {
      if (values[key]) formData.append(key, values[key]);
    });
    // Append image if selected
    if (image) formData.append('image', image);

    try {
      if (product) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }
      onSuccess();
      setSubmitError('');
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Operation failed';
      showToast(errorMessage, 'error');
      setSubmitError(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Name"
                fullWidth
                margin="normal"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                name="productCode"
                label="Product Code"
                fullWidth
                margin="normal"
                error={touched.productCode && !!errors.productCode}
                helperText={touched.productCode && errors.productCode}
              />
              <Field
                as={TextField}
                name="price"
                label="Price"
                type="number"
                fullWidth
                margin="normal"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                onWheel={(e) => e.target.blur()}
              />
              <Field
                as={TextField}
                name="category"
                label="Category"
                fullWidth
                margin="normal"
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category}
              />
              <Field
                as={TextField}
                name="manufactureDate"
                label="Manufacture Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={touched.manufactureDate && !!errors.manufactureDate}
                helperText={touched.manufactureDate && errors.manufactureDate}
              />
              <Field
                as={TextField}
                name="manufactureDate"
                label="Manufacture Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={touched.manufactureDate && !!errors.manufactureDate}
                helperText={touched.manufactureDate && errors.manufactureDate}
              />
              <Field
                as={TextField}
                name="expiryDate"
                label="Expiry Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={touched.expiryDate && !!errors.expiryDate}
                helperText={touched.expiryDate && errors.expiryDate}
              />
              <TextField
                type="file"
                label="Image"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <DialogActions>
                <Button
                  onClick={() => {
                    setSubmitError('');
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {product ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
