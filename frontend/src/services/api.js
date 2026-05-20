const API_BASE_URL = "http://127.0.0.1:8000";

let authToken = localStorage.getItem('access_token');

// async function handleResponse(response) {
//   if (!response.ok) {
//     let message = "Request failed";
//     try {
//       const errorData = await response.json();
//       message = errorData.detail || message;
//     } catch {
//       message = "Request failed";
//     }
//     throw new Error(message);
//   }

//   return response.json();
// }

// export async function fetchProducts() {
//   const response = await fetch(`${API_BASE_URL}/products`);
//   return handleResponse(response);
// }

// export async function fetchCart() {
//   const response = await fetch(`${API_BASE_URL}/cart`);
//   return handleResponse(response);
// }

// export async function addToCart(productId, quantity = 1) {
//   const response = await fetch(
//     `${API_BASE_URL}/cart/add?product_id=${productId}&quantity=${quantity}`,
//     { method: "POST" }
//   );
//   return handleResponse(response);
// }

// export async function updateCartItem(cartItemId, quantity) {
//   const response = await fetch(
//     `${API_BASE_URL}/cart/update?cart_item_id=${cartItemId}&quantity=${quantity}`,
//     { method: "PUT" }
//   );
//   return handleResponse(response);
// }

// export async function deleteCartItem(cartItemId) {
//   const response = await fetch(
//     `${API_BASE_URL}/cart/delete?cart_item_id=${cartItemId}`,
//     { method: "DELETE" }
//   );
//   return handleResponse(response);
// }


export function setAuthToken(token) {
  authToken = token;
  if (token) localStorage.setItem('access_token', token);
  else localStorage.removeItem('access_token');
}

export function getAuthToken() {
  return authToken || localStorage.getItem('access_token');
}

export function logout() {
  setAuthToken(null);
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === 'string') {
        message = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
        message = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
        } else if (errorData.message) {
        message = errorData.message;
        } else {
        message = JSON.stringify(errorData);
        }
      } catch {
        message = response.statusText || `HTTP ${response.status}`;
      }
      throw new Error(message);
    }
  return response.json();
}
export async function registerUser(userData) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
}

export async function loginUser(credentials) {
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  setAuthToken(data.access_token);
  return data;
}

export async function fetchMe() {
  return request('/auth/me');
}

export async function fetchProducts(search = '') {
  const url = search ? `/products?search=${encodeURIComponent(search)}` : '/products';
  return request(url);
}

export async function fetchCart() {
  return request('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return request(`/cart/add-query?product_id=${productId}&quantity=${quantity}`, { method: 'POST' });
}

export async function updateCartItem(cartItemId, quantity) {
  return request(`/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

export async function deleteCartItem(cartItemId) {
  return request(`/cart/${cartItemId}`, { method: 'DELETE' });
}

export async function createProduct(productData) {
  return request('/products', { method: 'POST', body: JSON.stringify(productData) });
}

export async function updateProduct(productId, productData) {
  return request(`/products/${productId}`, { method: 'PUT', body: JSON.stringify(productData) });
}

export async function deleteProduct(productId) {
  return request(`/products/${productId}`, { method: 'DELETE' });
}

export async function fetchAllUsers() {
  return request('/admin/users');
}

export async function fetchAllCarts() {
  return request('/admin/carts');
}