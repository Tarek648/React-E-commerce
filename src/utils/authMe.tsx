
export const fetchUserDetails = async (): Promise<string> => {
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
      return "User";
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return "Guest";
    }
  };
  