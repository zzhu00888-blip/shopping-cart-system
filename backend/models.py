from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """Application user account.

    role can be "user" or "admin".
    """

    __tablename__ = "app_user"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True)
    hashed_password: str
    role: str = Field(default="user", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Product(SQLModel, table=True):
    """Product entity used by the e-commerce shopping cart system."""

    # Keep the original Assignment 1 table name: product
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    image_url: str
    stock: int = 0


class CartItem(SQLModel, table=True):
    """Shopping cart item.

    Each cart item now belongs to one logged-in user.
    """

    # Keep the original Assignment 1 table name: cartitem
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    product_id: int = Field(index=True)
    quantity: int = 1
