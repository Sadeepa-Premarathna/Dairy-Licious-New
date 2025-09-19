import React, { useState, useEffect } from 'react';
import { Product, ProductFilter } from '../types/product';
import { productService } from '../services/productService';
import ProductForm from './ProductForm';
import './AdminProductManagement.css';

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filter, setFilter] = useState<ProductFilter>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAdminProducts(filter);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.categories.map(cat => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    setFilter({ ...filter, search: searchTerm, page: 1 });
  };

  const handleSort = (sortBy: string) => {
    const sortOrder = filter.sortBy === sortBy && filter.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilter({ ...filter, sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'stock' | 'category', sortOrder, page: 1 });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
        // Remove from selected if it was selected
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to mark ${selectedProducts.length} products as ${status}?`)) {
      try {
        await productService.bulkUpdateProducts(selectedProducts, { status: status as any });
        setSelectedProducts([]);
        fetchProducts();
      } catch (error) {
        console.error('Error updating products:', error);
        alert('Failed to update products. Please try again.');
      }
    }
  };

  const handleProductSave = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id!));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      draft: 'status-draft',
      outOfStock: 'status-out-of-stock'
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{status}</span>;
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { className: 'stock-out', text: 'Out of Stock' };
    if (product.stock <= (product.minStock || 5)) return { className: 'stock-low', text: 'Low Stock' };
    return { className: 'stock-normal', text: 'In Stock' };
  };

  return (
    <div className="admin-product-management">
      <div className="product-header">
        <div className="header-left">
          <h2>Product Management</h2>
          <p>Manage your dairy products inventory</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          <span className="btn-icon">+</span>
          Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.status === 'active').length}</h3>
            <p>Active Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.featured).length}</h3>
            <p>Featured Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.stock <= (p.minStock || 5)).length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
      </div>

      <div className="product-controls">
        <div className="search-bar">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              🔍 Search
            </button>
          </div>
        </div>

        <div className="filter-controls">
          <select 
            value={filter.status || ''} 
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          <select 
            value={filter.category || ''} 
            onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filter.featured?.toString() || ''}
            onChange={(e) => setFilter({ 
              ...filter, 
              featured: e.target.value ? e.target.value === 'true' : undefined, 
              page: 1 
            })}
          >
            <option value="">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
        </div>

        {selectedProducts.length > 0 && (
          <div className="bulk-actions">
            <span className="selection-count">{selectedProducts.length} selected</span>
            <button onClick={() => handleBulkStatusUpdate('active')} className="btn-success">
              Mark Active
            </button>
            <button onClick={() => handleBulkStatusUpdate('inactive')} className="btn-warning">
              Mark Inactive
            </button>
            <button onClick={() => handleBulkStatusUpdate('draft')} className="btn-secondary">
              Mark Draft
            </button>
          </div>
        )}
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={selectAllProducts}
                />
              </th>
              <th>Image</th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {filter.sortBy === 'name' && (filter.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {filter.sortBy === 'category' && (filter.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Price {filter.sortBy === 'price' && (filter.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('stock')} className="sortable">
                Stock {filter.sortBy === 'stock' && (filter.sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="loading">
                  <div className="loading-spinner"></div>
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="no-data">
                  <div className="no-data-icon">📦</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product._id} className={selectedProducts.includes(product._id!) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id!)}
                        onChange={() => toggleProductSelection(product._id!)}
                      />
                    </td>
                    <td>
                      <div className="product-image">
                        {product.thumbnail ? (
                          <img 
                            src={product.thumbnail} 
                            alt={product.name}
                            className="product-thumbnail"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="product-name">
                      <div>
                        <strong>{product.name}</strong>
                        <div className="product-sku">SKU: {product.sku}</div>
                        {product.brand && <div className="product-brand">{product.brand}</div>}
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{product.category}</span>
                    </td>
                    <td className="price-column">
                      <div className="price-display">
                        <span className="current-price">₹{product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={`stock-info ${stockStatus.className}`}>
                        <span className="stock-count">{product.stock}</span>
                        <span className="stock-status">{stockStatus.text}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      <div className="featured-badge">
                        {product.featured ? '⭐ Featured' : ''}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="btn-edit"
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id!)}
                          className="btn-delete"
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                        <button 
                          className="btn-view"
                          title="View in Shop"
                          onClick={() => window.open(`/shop/product/${product._id}`, '_blank')}
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={filter.page === 1}
            onClick={() => setFilter({ ...filter, page: (filter.page || 1) - 1 })}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            <span>Page {filter.page} of {totalPages}</span>
            <span className="total-count">({products.length} products)</span>
          </div>
          
          <button 
            disabled={filter.page === totalPages}
            onClick={() => setFilter({ ...filter, page: (filter.page || 1) + 1 })}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <ProductForm 
              product={editingProduct}
              onSave={handleProductSave}
              onCancel={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
