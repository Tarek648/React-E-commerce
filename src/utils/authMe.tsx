export const fetchUserDetails = async ()=> {
    const token = localStorage.getItem("accessToken");
    if (!token) return "Guest"; 
  
    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const userData = await response.json();
        return userData.username || "Guest";
      }
      return "Guest";
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return "Guest";
    }
  };
  