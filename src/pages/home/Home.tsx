import { useEffect, useState } from "react";
import Index from "../../component/product-card/Index";
import { api, setupAxiosInterceptor } from "../../utils/HTTP";
import Header from "../../component/header/Header";
import Navbar from "../../component/navbar/Navbar";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

function Home() {
  useEffect(() => {
    document.title = "Home Page";
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const cleanupInterceptor = setupAxiosInterceptor();
    
    return () => {
      cleanupInterceptor();
    };
  }, []);

  function fetchProducts() {
    api.get<{ products: Product[] }>("/products")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  useEffect(() => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);


  const searchProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />
      <Navbar onSearch={(s: string) => setSearch(s)} cartCount={cartCount} />
      <div className="container">
        <div className="product-grid">
          {searchProducts.length > 0 ? (
            searchProducts.map((product, i) => (
              <div key={i}>
                <Index {...product} />
              </div>
            ))
          ) : (
            <h2>No products found</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;