import { useEffect, useMemo, useState } from "react";
import {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "./services/api";
import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [productData, cartData] = await Promise.all([
        fetchProducts(),
        fetchCart(),
      ]);
      setProducts(productData);
      setCartItems(cartData);
    } catch (err) {
      setError(err.message || "Failed to load data from backend");
    } finally {
      setLoading(false);
    }
  }

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((product) => {
      map[product.id] = product;
    });
    return map;
  }, [products]);

  const cartView = useMemo(() => {
    return cartItems.map((item) => {
      const product = productMap[item.product_id];
      const productName = product ? product.name : `Product #${item.product_id}`;
      const price = product ? Number(product.price) : 0;
      const imageUrl = product ? product.image_url : "";
      return {
        ...item,
        productName,
        price,
        imageUrl,
        subtotal: price * item.quantity,
      };
    });
  }, [cartItems, productMap]);

  const cartTotal = useMemo(() => {
    return cartView.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartView]);

  async function handleAddToCart(productId) {
    try {
      setError("");
      setActionLoadingId(`add-${productId}`);
      await addToCart(productId, 1);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to add product to cart");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleIncrease(item) {
    try {
      setError("");
      setActionLoadingId(`cart-${item.id}`);
      await updateCartItem(item.id, item.quantity + 1);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update quantity");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDecrease(item) {
    try {
      setError("");
      setActionLoadingId(`cart-${item.id}`);

      if (item.quantity <= 1) {
        await deleteCartItem(item.id);
      } else {
        await updateCartItem(item.id, item.quantity - 1);
      }

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update quantity");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleRemove(itemId) {
    try {
      setError("");
      setActionLoadingId(`remove-${itemId}`);
      await deleteCartItem(itemId);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete cart item");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Shopping Cart App</h1>
          <p>UTS Assignment 1</p>
        </div>
        <div className="cart-badge">Items in cart: {cartItems.length}</div>
      </header>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="loading-box">Loading data...</div>
      ) : (
        <div className="layout">
          <section className="products-section">
            <div className="section-title-row">
              <h2>Products</h2>
              <button className="secondary-button" onClick={loadData}>
                Refresh
              </button>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image_url} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${Number(product.price).toFixed(2)}</p>
                  <p className="stock">Stock: {product.stock}</p>
                  <button
                    className="primary-button"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={actionLoadingId === `add-${product.id}`}
                  >
                    {actionLoadingId === `add-${product.id}`
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-section">
            <div className="section-title-row">
              <h2>Cart</h2>
            </div>

            {cartView.length === 0 ? (
              <p className="empty-text">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-list">
                  {cartView.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-top">
                        {item.imageUrl ? (
                          <img
                            className="cart-thumb"
                            src={item.imageUrl}
                            alt={item.productName}
                          />
                        ) : (
                          <div className="cart-thumb placeholder" />
                        )}

                        <div className="cart-item-info">
                          <h4>{item.productName}</h4>
                          <p>Unit Price: ${item.price.toFixed(2)}</p>
                          <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="cart-actions">
                        <div className="quantity-controls">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={actionLoadingId === `cart-${item.id}`}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={actionLoadingId === `cart-${item.id}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="danger-button"
                          onClick={() => handleRemove(item.id)}
                          disabled={actionLoadingId === `remove-${item.id}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <strong>Total: ${cartTotal.toFixed(2)}</strong>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;