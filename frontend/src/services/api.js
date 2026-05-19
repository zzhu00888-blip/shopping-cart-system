const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      message = "Request failed";
    }
    throw new Error(message);
  }

  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
}

export async function fetchCart() {
  const response = await fetch(`${API_BASE_URL}/cart`);
  return handleResponse(response);
}

export async function addToCart(productId, quantity = 1) {
  const response = await fetch(
    `${API_BASE_URL}/cart/add?product_id=${productId}&quantity=${quantity}`,
    { method: "POST" }
  );
  return handleResponse(response);
}

export async function updateCartItem(cartItemId, quantity) {
  const response = await fetch(
    `${API_BASE_URL}/cart/update?cart_item_id=${cartItemId}&quantity=${quantity}`,
    { method: "PUT" }
  );
  return handleResponse(response);
}

export async function deleteCartItem(cartItemId) {
  const response = await fetch(
    `${API_BASE_URL}/cart/delete?cart_item_id=${cartItemId}`,
    { method: "DELETE" }
  );
  return handleResponse(response);
}