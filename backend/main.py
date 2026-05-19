from typing import List

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from auth import create_access_token, decode_access_token
from crud import (
    add_to_cart,
    authenticate_user,
    create_product,
    create_user,
    delete_cart_item,
    delete_product,
    get_all_products,
    get_all_users,
    get_cart_items_by_user,
    get_user_by_email,
    get_user_by_id,
    search_products,
    seed_demo_data,
    update_cart_item_quantity,
    update_product,
)
from database import create_db_and_tables, engine
from models import CartItem, Product, User
from schemas import (
    AdminUserCart,
    CartItemCreate,
    CartItemRead,
    CartItemUpdate,
    LoginRequest,
    ProductCreate,
    ProductRead,
    ProductUpdate,
    TokenResponse,
    UserCreate,
    UserRead,
)

app = FastAPI(title="Shopping Cart Backend", version="2.0.0")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_session():
    with Session(engine) as session:
        yield session


def get_current_user(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
) -> User:
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_id(session, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


def to_user_read(user: User) -> UserRead:
    return UserRead(id=user.id, username=user.username, email=user.email, role=user.role)


def to_product_read(product: Product) -> ProductRead:
    return ProductRead(
        id=product.id,
        name=product.name,
        description=product.description,
        price=float(product.price),
        image_url=product.image_url,
        stock=product.stock,
    )


def to_cart_item_read(session: Session, item: CartItem) -> CartItemRead:
    product = session.get(Product, item.product_id)
    product_read = to_product_read(product) if product else None
    price = float(product.price) if product else 0
    return CartItemRead(
        id=item.id,
        user_id=item.user_id,
        product_id=item.product_id,
        quantity=item.quantity,
        product=product_read,
        line_total=round(price * item.quantity, 2),
    )


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        seed_demo_data(session)


@app.get("/")
def read_root():
    return {
        "message": "Shopping Cart Backend is running",
        "version": "2.0.0",
        "docs": "/docs",
    }


# -------------------------
# Authentication
# -------------------------

@app.post("/auth/register", response_model=UserRead)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    if get_user_by_email(session, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user = create_user(session, user_data, role="user")
    return to_user_read(user)


@app.post("/auth/login", response_model=TokenResponse)
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    user = authenticate_user(session, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=access_token, user=to_user_read(user))


@app.get("/auth/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return to_user_read(current_user)


# -------------------------
# Product APIs
# -------------------------

@app.get("/products", response_model=List[ProductRead])
def read_products(
    search: str = Query(default="", description="Optional real-time search keyword"),
    session: Session = Depends(get_session),
):
    products = search_products(session, search) if search else get_all_products(session)
    return [to_product_read(product) for product in products]


@app.get("/products/search", response_model=List[ProductRead])
def search_product_endpoint(keyword: str = "", session: Session = Depends(get_session)):
    products = search_products(session, keyword)
    return [to_product_read(product) for product in products]


@app.post("/products", response_model=ProductRead)
def add_product_endpoint(
    product_data: ProductCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_admin),
):
    product = create_product(session, product_data)
    return to_product_read(product)


@app.put("/products/{product_id}", response_model=ProductRead)
def update_product_endpoint(
    product_id: int,
    product_data: ProductUpdate,
    session: Session = Depends(get_session),
    _: User = Depends(require_admin),
):
    product = update_product(session, product_id, product_data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return to_product_read(product)


@app.delete("/products/{product_id}")
def delete_product_endpoint(
    product_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_admin),
):
    deleted = delete_product(session, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# -------------------------
# Cart APIs for logged-in users
# -------------------------

@app.get("/cart", response_model=List[CartItemRead])
def read_my_cart(
    session: Session = Depends(get_session), current_user: User = Depends(get_current_user)
):
    cart_items = get_cart_items_by_user(session, current_user.id)
    return [to_cart_item_read(session, item) for item in cart_items]


@app.post("/cart/add", response_model=CartItemRead)
def add_product_to_cart(
    cart_data: CartItemCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cart_item = add_to_cart(
        session=session,
        user_id=current_user.id,
        product_id=cart_data.product_id,
        quantity=cart_data.quantity,
    )
    if cart_item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return to_cart_item_read(session, cart_item)


# Compatibility endpoint for your old Assignment 1 frontend style:
# POST /cart/add-query?product_id=1&quantity=1
@app.post("/cart/add-query", response_model=CartItemRead)
def add_product_to_cart_query(
    product_id: int,
    quantity: int = 1,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cart_item = add_to_cart(session, current_user.id, product_id, quantity)
    if cart_item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return to_cart_item_read(session, cart_item)


@app.put("/cart/{cart_item_id}", response_model=CartItemRead)
def update_my_cart_item(
    cart_item_id: int,
    cart_data: CartItemUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    updated_item = update_cart_item_quantity(
        session, current_user.id, cart_item_id, cart_data.quantity
    )
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return to_cart_item_read(session, updated_item)


# Compatibility endpoint for old frontend style:
# PUT /cart/update?cart_item_id=1&quantity=2
@app.put("/cart/update", response_model=CartItemRead)
def update_my_cart_item_query(
    cart_item_id: int,
    quantity: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    updated_item = update_cart_item_quantity(session, current_user.id, cart_item_id, quantity)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return to_cart_item_read(session, updated_item)


@app.delete("/cart/{cart_item_id}")
def remove_my_cart_item(
    cart_item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_cart_item(session, current_user.id, cart_item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted successfully"}


# Compatibility endpoint for old frontend style:
# DELETE /cart/delete?cart_item_id=1
@app.delete("/cart/delete")
def remove_my_cart_item_query(
    cart_item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_cart_item(session, current_user.id, cart_item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted successfully"}


# -------------------------
# Admin APIs
# -------------------------

@app.get("/admin/users", response_model=List[UserRead])
def admin_get_users(
    session: Session = Depends(get_session), _: User = Depends(require_admin)
):
    users = get_all_users(session)
    return [to_user_read(user) for user in users]


@app.get("/admin/users/{user_id}/cart", response_model=AdminUserCart)
def admin_get_user_cart(
    user_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_admin),
):
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cart_items = [to_cart_item_read(session, item) for item in get_cart_items_by_user(session, user.id)]
    cart_total = round(sum(item.line_total for item in cart_items), 2)
    return AdminUserCart(user=to_user_read(user), cart_items=cart_items, cart_total=cart_total)


@app.get("/admin/carts", response_model=List[AdminUserCart])
def admin_get_all_carts(
    session: Session = Depends(get_session), _: User = Depends(require_admin)
):
    result = []
    for user in get_all_users(session):
        cart_items = [to_cart_item_read(session, item) for item in get_cart_items_by_user(session, user.id)]
        cart_total = round(sum(item.line_total for item in cart_items), 2)
        result.append(AdminUserCart(user=to_user_read(user), cart_items=cart_items, cart_total=cart_total))
    return result
