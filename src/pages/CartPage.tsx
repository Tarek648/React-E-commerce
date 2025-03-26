import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import "./CartPage.css";

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
    document.title="Cart Page"
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
  
      try {
        const response = await fetch("https://dummyjson.com/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username || "User"); 
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    const fetchCartData = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(localCart.length > 0 ? localCart : []);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      }
    };
  
    fetchUserDetails(); 
    fetchCartData(); 
  }, []);

  const getShippingCost = () => {
    const total = parseFloat(getTotal());

    if (total > 100) {
      return 0;
    }

    if (total > 50) {
      return 25;
    }
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
      const authCheck = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!authCheck.ok) throw new Error("Authentication failed");

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
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <IconButton className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </IconButton>
        <h1 className="cart-title">{username}'s Cart </h1>
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
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      className="btn-quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="btn-quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
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
