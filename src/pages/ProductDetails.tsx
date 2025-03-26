import { useNavigate, useLocation } from "react-router-dom";
import "./ProductDetails.css";
import { useEffect } from "react";


interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
}

interface CartItem extends Product {
  quantity: number;
}

function ProductDetails() {
  useEffect(() => {
    document.title = "Product Page";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state as Product;

  const addToCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
    navigate("/")
  };



  return (
    <div className="product-details-container">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="product-info">
        <h1 className="product-title">{product.title}</h1>
        <p className="product-price">
          <strong>${product.price}</strong>
        </p>
        <p className="product-description">{product.description}</p>
        <button onClick={addToCart} className="btn-buy">
          Add to Cart
        </button>
        <button onClick={() => navigate(-1)} className="btn-back">
          Back
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;