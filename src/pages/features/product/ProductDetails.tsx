import { useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { useEffect, useState } from "react";
import { api } from "../../../utils/HTTP";

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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

useEffect(() => {
  document.title = "Product Page";
  const productId = window.location.pathname.split("/").pop();

  api.get(`/products/${productId}`)
    .then(({ data }) => setProduct(data))
    .catch((error) => {
      console.error("Error fetching product:", error);
      navigate("/", { replace: true });
    });
}, [navigate]);
  const addToCart = () => {
    if (!product) return;
    
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  if (!product) {
    return (
      <div className="product-details-container">
        <p>Loading product...</p>
      </div>
    );
  }

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
        <button onClick={() => navigate("/")} className="btn-back">
          Back
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;