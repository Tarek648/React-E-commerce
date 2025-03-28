import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/features/product/ProductDetails";
import Login from "./pages/features/auth/Login";
import Register from "./pages/features/auth/Register";
import ProtectedRoute from "./component/ProtectedRoute";
import CartPage from "./pages/features/cart/CartPage";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
