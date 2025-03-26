import "./Navbar.css";
import { IoSearch, IoCart } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface NavbarP {
  onSearch: (s: string) => void;
  cartCount: number; 
}

function Navbar({ onSearch, cartCount }: NavbarP) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("Guest");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUsername = localStorage.getItem("username");

    if (accessToken) {
      fetchUserDetails(accessToken);
    }

    setIsLoggedIn(!!accessToken);
    setUsername(storedUsername || "Guest");
  }, []);

  const fetchUserDetails = async (accessToken: string) => {
    try {
      const res = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        },
      });

      const userData = await res.json();
      if (userData.message) {
        console.error("Error from API:", userData.message); 
      } else {
        setUsername(userData.username || "Guest");
        localStorage.setItem("username", userData.username);
      }
    } catch (err) {
      console.error("Error fetching user details:", err); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userDetails");
    setIsLoggedIn(false);
    setUsername("Guest");
    navigate("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setSearch(s); 
    onSearch(s); 
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">
        <div className="navbar-left">
          <span className="navbar-language">En</span>
          <div className="navbar-searchContainer">
            <input
              type="text"
              placeholder="Search"
              className="navbar-input"
              value={search}
              onChange={handleSearchChange}
            />
            <IoSearch className="icon" />
          </div>
        </div>

        <div className="navbar-center">
          <h1 className="navbar-logo">
            Hello <span>{username}</span>
          </h1>
        </div>
        <div className="navbar-right">
          <div className="navbar-cart" onClick={handleCartClick}>
            <IoCart className="cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="navbar-menuItem logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-menuItem login">
                Login
              </Link>
              <Link to="/register" className="navbar-menuItem register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;