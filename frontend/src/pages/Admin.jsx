import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchAllUsers, fetchAllCarts } from '../services/api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, image_url: '', stock: 0 });

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };
  const loadUsers = async () => {
    const data = await fetchAllUsers();
    setUsers(data);
  };
  const loadCarts = async () => {
    const data = await fetchAllCarts();
    setCarts(data);
  };

  useEffect(() => {
    loadProducts();
    loadUsers();
    loadCarts();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, image_url: '', stock: 0 });
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(productId);
      loadProducts();
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>Product Management</button>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>All Users</button>
        <button onClick={() => setActiveTab('carts')} className={activeTab === 'carts' ? 'active' : ''}>All Carts</button>
      </div>

      {activeTab === 'products' && (
        <div>
          <h3>{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>
          <form onSubmit={handleProductSubmit} className="product-form">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
            <input type="text" placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} required />
            <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} required />
            <button type="submit">{editingProduct ? 'Update' : 'Create'}</button>
            {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: 0, image_url: '', stock: 0 }); }}>Cancel</button>}
          </form>

          <div className="products-grid">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <img src={p.image_url} alt={p.name} />
                <h3>{p.name}</h3>
                <p>${p.price}</p>
                <p>Stock: {p.stock}</p>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} className="danger-button">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <table className="data-table">
          <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'carts' && (
        <div>
          {carts.map(cart => (
            <div key={cart.user.id} className="user-cart-section">
              <h3>{cart.user.username} (ID: {cart.user.id}) - Total: ${cart.cart_total}</h3>
              {cart.cart_items.length === 0 ? <p>Empty cart</p> : (
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {cart.cart_items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product?.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.product?.price}</td>
                        <td>${item.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}