import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import "./CartPage.css";
import { fetchUserDetails } from "../../../utils/authMe";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    document.title = "Cart Page";
    const loadUserData = async () => {
      const username = await fetchUserDetails();
      setUsername(username);
    };
  
    loadUserData();
  
    const fetchCartData = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const validatedCart = localCart.filter((item: any) => 
          item && 
          typeof item.id === 'number' && 
          typeof item.price === 'number' &&
          typeof item.quantity === 'number'
        );
        setCart(validatedCart.length > 0 ? validatedCart : []);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      }
    };
  
    fetchCartData(); 
  }, []);

  const getShippingCost = () => {
    const total = parseFloat(getTotal());
    if (isNaN(total)) return 0;

    if (total > 100) return 0;
    if (total > 50) return 25;
    return 50;
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
    
      alert(`Order placed successfully! Thank you, ${username}!`);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const deleteItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    if (!cart || cart.length === 0) return "0.00";
    const total = cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
    return total.toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <IconButton className="btn-back" onClick={() => navigate("/")}>
          <FaArrowLeft />
        </IconButton>
        <h1 className="cart-title">{username}'s Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn-continue" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => {
              if (!item) return null;
              const price = item.price || 0;
              const quantity = item.quantity || 0;
              
              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.thumbnail || '/placeholder-image.jpg'}
                    alt={item.title || 'Product image'}
                    className="cart-item-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="cart-item-details">
                    <h3>{item.title || 'Untitled Product'}</h3>
                    <p>Price: ${price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        +
                      </button>
                      <IconButton
                        className="btn-remove"
                        onClick={() => deleteItem(item.id)}
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </div>
                    <p className="item-total">
                      Total: ${(price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">
                {parseFloat(getTotal()) < 50
                  ? `For 50% off shipping, you still need $${(
                      50 - parseFloat(getTotal())
                    ).toFixed(2)}`
                  : parseFloat(getTotal()) < 100
                  ? `For Free shipping, you still need $${(
                      100 - parseFloat(getTotal())
                    ).toFixed(2)}`
                  : ""}
              </span>
              <span>${getShippingCost()}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>
                ${(parseFloat(getTotal()) + getShippingCost()).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-checkout"
            disabled={isLoading || cart.length === 0}
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;