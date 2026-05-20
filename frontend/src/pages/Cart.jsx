import { useState, useEffect } from 'react';
import { fetchCart, updateCartItem, deleteCartItem } from '../services/api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleIncrease = async (item) => {
    await updateCartItem(item.id, item.quantity + 1);
    loadCart();
  };
  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      await deleteCartItem(item.id);
    } else {
      await updateCartItem(item.id, item.quantity - 1);
    }
    loadCart();
  };
  const handleRemove = async (itemId) => {
    await deleteCartItem(itemId);
    loadCart();
  };

  const total = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  if (loading) return <div className="loading-box">Loading cart...</div>;
  if (error) return <div className="error-box">{error}</div>;

  return (
    <div>
      <h2>My Cart</h2>
      {cartItems.length === 0 && <p className="empty-text">Your cart is empty.</p>}
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-top">
            <img className="cart-thumb" src={item.product?.image_url} alt={item.product?.name} />
            <div className="cart-item-info">
              <h4>{item.product?.name}</h4>
              <p>Unit Price: ${item.product?.price}</p>
              <p>Subtotal: ${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
            </div>
          </div>
          <div className="cart-actions">
            <div className="quantity-controls">
              <button onClick={() => handleDecrease(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleIncrease(item)}>+</button>
            </div>
            <button className="danger-button" onClick={() => handleRemove(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
}