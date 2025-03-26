import './Index.css';
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  description: string; 
}

function Index(props: Product) {
  const navigate = useNavigate();

  const MinimizeTitle = (title: string, maxWords: number) => {
    const words = title.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'; 
    }
    return title;
  };

  const handleShopNow = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("You need to login first.");
      navigate("/login");
    } else {
      navigate("/product-details", { state: props }); 
    }
  };

  return (
     <div className="cards">
       <img src={props.thumbnail} className="card-img-top" alt={props.title} />
       <div className="card-body">
         <h5 className="card-title">{MinimizeTitle(props.title, 4)}</h5>
         <p className="card-text"><strong>${props.price}</strong></p>
         <button onClick={handleShopNow} className="btn-shop">
           Shop Now
         </button>
       </div>
     </div>
  );
}

export default Index;