from typing import List, Optional

from sqlmodel import SQLModel


class UserCreate(SQLModel):
    username: str
    email: str
    password: str


class UserRead(SQLModel):
    id: int
    username: str
    email: str
    role: str


class LoginRequest(SQLModel):
    email: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class ProductCreate(SQLModel):
    name: str
    description: str
    price: float
    image_url: str
    stock: int = 0


class ProductUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None


class ProductRead(SQLModel):
    id: int
    name: str
    description: str
    price: float
    image_url: str
    stock: int


class CartItemCreate(SQLModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(SQLModel):
    quantity: int


class CartItemRead(SQLModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    product: Optional[ProductRead] = None
    line_total: float = 0


class AdminUserCart(SQLModel):
    user: UserRead
    cart_items: List[CartItemRead]
    cart_total: float
