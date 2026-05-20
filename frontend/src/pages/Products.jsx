import { useState, useEffect } from 'react';
import { fetchProducts, addToCart } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const { user } = useAuth();

  const loadProducts = async (keyword = '') => {
    try {
      setLoading(true);
      const data = await fetchProducts(keyword);
      setProducts(data);
      const initialQuantities = {};
      data.forEach(p => { initialQuantities[p.id] = 1; });
      setQuantities(initialQuantities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleQuantityChange = (productId, newQuantity) => {
    const val = parseInt(newQuantity, 10);
    if (isNaN(val) || val < 1) return;
    setQuantities(prev => ({ ...prev, [productId]: val }));
  };

  const handleAdd = async (productId) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    const quantity = quantities[productId] || 1;
    try {
      await addToCart(productId, quantity);
      alert(`Added ${quantity} item(s) to cart`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {error && <div className="error-box">{error}</div>}
      {loading ? (
        <div className="loading-box">Loading...</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image_url} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="description">{p.description}</p>
              <p className="price">${Number(p.price).toFixed(2)}</p>
              <p className="stock">Stock: {p.stock}</p>
              <div className="quantity-selector">
                <label>Qty: </label>
                <input
                  type="number"
                  min="1"
                  max={p.stock}
                  value={quantities[p.id] || 1}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                  style={{ width: '60px', marginRight: '8px' }}
                />
              </div>
              <button className="primary-button" onClick={() => handleAdd(p.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}