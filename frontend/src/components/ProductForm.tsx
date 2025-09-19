import React, { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/product';
import { productService } from '../services/productService';
import './ProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    brand: '',
    sku: '',
    stock: 0,
    minStock: 5,
    status: 'active',
    featured: false,
    tags: [],
    specifications: [],
    dimensions: {},
    seo: {},
    discount: undefined
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category || '',
        subCategory: product.subCategory || '',
        brand: product.brand || '',
        sku: product.sku || '',
        stock: product.stock || 0,
        minStock: product.minStock || 5,
        status: product.status || 'active',
        featured: product.featured || false,
        tags: product.tags || [],
        specifications: product.specifications || [],
        dimensions: product.dimensions || {},
        seo: product.seo || {},
        discount: product.discount || undefined
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSpecificationChange = (index: number, field: 'name' | 'value', value: string) => {
    const specs = [...(formData.specifications || [])];
    specs[index] = { ...specs[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: specs }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), { name: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    const specs = [...(formData.specifications || [])];
    specs.splice(index, 1);
    setFormData(prev => ({ ...prev, specifications: specs }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.sku?.trim()) newErrors.sku = 'SKU is required';
    if (formData.stock === undefined || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    
    // Check if SKU already exists (you might want to implement this check)
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setCurrentStep(1); // Go back to first step where errors might be
      return;
    }
    
    setLoading(true);
    try {
      const submitFormData = productService.createFormData(formData, images || undefined);
      
      if (product?._id) {
        await productService.updateProduct(product._id, submitFormData);
      } else {
        await productService.createProduct(submitFormData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = () => {
    if (formData.name) {
      const sku = productService.generateSKU(formData.name);
      setFormData(prev => ({ ...prev, sku }));
    }
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
        <button onClick={onCancel} className="close-btn">×</button>
      </div>

      <div className="form-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <span>1</span> Basic Info
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <span>2</span> Pricing & Stock
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <span>3</span> Details & Media
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-content">
        {currentStep === 1 && (
          <div className="form-step">
            <h4>Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter product name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  <option value="Fresh Milk">Fresh Milk</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Cheese">Cheese</option>
                  <option value="Butter">Butter</option>
                  <option value="Yogurt">Yogurt</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Cream">Cream</option>
                  <option value="Beverages">Beverages</option>
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleInputChange}
                  placeholder="Product brand"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU *</label>
                <div className="sku-input-group">
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={errors.sku ? 'error' : ''}
                    placeholder="Product SKU"
                  />
                  <button type="button" onClick={generateSKU} className="generate-sku-btn">
                    Generate
                  </button>
                </div>
                {errors.sku && <span className="error-text">{errors.sku}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Detailed product description"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h4>Pricing & Inventory</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? 'error' : ''}
                  placeholder="0.00"
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="originalPrice">Original Price (₹)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  step="0.01"
                  value={formData.originalPrice || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <small>Leave empty if no discount</small>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={errors.stock ? 'error' : ''}
                  placeholder="0"
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="minStock">Minimum Stock Alert</label>
                <input
                  type="number"
                  id="minStock"
                  name="minStock"
                  value={formData.minStock || ''}
                  onChange={handleInputChange}
                  placeholder="5"
                />
                <small>Alert when stock falls below this number</small>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Featured Product
                </label>
                <small>Featured products appear prominently in the shop</small>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h4>Additional Details & Media</h4>
            
            <div className="form-group full-width">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                placeholder="organic, fresh, healthy, premium"
              />
              <small>Tags help customers find your products</small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="images">Product Images</label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
              />
              <small>You can select multiple images. First image will be used as thumbnail. Max 5MB each.</small>
            </div>

            <div className="specifications-section">
              <div className="section-header">
                <h5>Product Specifications</h5>
                <button type="button" onClick={addSpecification} className="btn-secondary">
                  + Add Specification
                </button>
              </div>
              
              {formData.specifications?.map((spec, index) => (
                <div key={index} className="specification-row">
                  <input
                    type="text"
                    placeholder="Specification name (e.g., Fat Content)"
                    value={spec.name}
                    onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 3.5%)"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="btn-delete-spec"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-navigation">
          <div className="nav-left">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn-secondary"
              >
                ← Previous
              </button>
            )}
          </div>
          
          <div className="nav-right">
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary"
              >
                Next →
              </button>
            ) : (
              <div className="final-actions">
                <button type="button" onClick={onCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
