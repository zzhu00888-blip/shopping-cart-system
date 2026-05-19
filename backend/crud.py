from typing import List, Optional

from sqlmodel import Session, select

from auth import hash_password, verify_password
from models import CartItem, Product, User
from schemas import ProductCreate, ProductUpdate, UserCreate


# -------------------------
# User / Authentication CRUD
# -------------------------

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)


def create_user(session: Session, user_data: UserCreate, role: str = "user") -> User:
    user = User(
        username=user_data.username.strip(),
        email=user_data.email.strip().lower(),
        hashed_password=hash_password(user_data.password),
        role=role,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(session, email.strip().lower())
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_all_users(session: Session) -> List[User]:
    statement = select(User).order_by(User.id)
    return list(session.exec(statement).all())


# -------------------------
# Product CRUD
# -------------------------

def get_all_products(session: Session) -> List[Product]:
    statement = select(Product).order_by(Product.id)
    return list(session.exec(statement).all())


def search_products(session: Session, keyword: str) -> List[Product]:
    keyword = (keyword or "").strip()
    if not keyword:
        return get_all_products(session)

    pattern = f"%{keyword}%"
    statement = (
        select(Product)
        .where((Product.name.like(pattern)) | (Product.description.like(pattern)))
        .order_by(Product.id)
    )
    return list(session.exec(statement).all())


def create_product(session: Session, product_data: ProductCreate) -> Product:
    product = Product(**product_data.dict())
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


def update_product(session: Session, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
    product = session.get(Product, product_id)
    if not product:
        return None

    update_data = product_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


def delete_product(session: Session, product_id: int) -> bool:
    product = session.get(Product, product_id)
    if not product:
        return False

    # Remove cart items that reference this product first.
    related_items = session.exec(select(CartItem).where(CartItem.product_id == product_id)).all()
    for item in related_items:
        session.delete(item)

    session.delete(product)
    session.commit()
    return True


# -------------------------
# Shopping Cart CRUD
# -------------------------

def get_cart_items_by_user(session: Session, user_id: int) -> List[CartItem]:
    statement = select(CartItem).where(CartItem.user_id == user_id).order_by(CartItem.id)
    return list(session.exec(statement).all())


def add_to_cart(session: Session, user_id: int, product_id: int, quantity: int = 1) -> Optional[CartItem]:
    if quantity < 1:
        quantity = 1

    product = session.get(Product, product_id)
    if not product:
        return None

    statement = select(CartItem).where(
        (CartItem.user_id == user_id) & (CartItem.product_id == product_id)
    )
    existing_item = session.exec(statement).first()

    if existing_item:
        existing_item.quantity += quantity
        session.add(existing_item)
        session.commit()
        session.refresh(existing_item)
        return existing_item

    new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item


def update_cart_item_quantity(
    session: Session, user_id: int, cart_item_id: int, quantity: int
) -> Optional[CartItem]:
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item or cart_item.user_id != user_id:
        return None

    if quantity < 1:
        session.delete(cart_item)
        session.commit()
        return None

    cart_item.quantity = quantity
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item


def delete_cart_item(session: Session, user_id: int, cart_item_id: int) -> bool:
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item or cart_item.user_id != user_id:
        return False

    session.delete(cart_item)
    session.commit()
    return True


# -------------------------
# Demo seed data
# -------------------------

def seed_demo_data(session: Session) -> None:
    """Create demo users and products if the database is empty."""

    if not get_user_by_email(session, "admin@example.com"):
        create_user(
            session,
            UserCreate(username="Admin", email="admin@example.com", password="admin123"),
            role="admin",
        )

    if not get_user_by_email(session, "user@example.com"):
        create_user(
            session,
            UserCreate(username="Demo User", email="user@example.com", password="user123"),
            role="user",
        )

    products = get_all_products(session)
    if products:
        return

    demo_products = [
        ProductCreate(
            name="Wireless Mouse",
            description="Comfortable wireless mouse for daily use",
            price=29.99,
            image_url="https://via.placeholder.com/300x200",
            stock=20,
        ),
        ProductCreate(
            name="Mechanical Keyboard",
            description="RGB mechanical keyboard with blue switches",
            price=89.99,
            image_url="https://via.placeholder.com/300x200",
            stock=15,
        ),
        ProductCreate(
            name="USB-C Hub",
            description="Multi-port USB-C hub for laptops and tablets",
            price=45.50,
            image_url="https://via.placeholder.com/300x200",
            stock=30,
        ),
        ProductCreate(
            name="Gaming Headset",
            description="Over-ear gaming headset with noise-cancelling mic",
            price=79.00,
            image_url="https://via.placeholder.com/300x200",
            stock=12,
        ),
        ProductCreate(
            name="Laptop Stand",
            description="Adjustable aluminium laptop stand",
            price=39.90,
            image_url="https://via.placeholder.com/300x200",
            stock=25,
        ),
    ]

    for product_data in demo_products:
        create_product(session, product_data)
