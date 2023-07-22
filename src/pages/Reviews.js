import { useEffect, useState } from "react";
import customAxios from "../services/api";
 
const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    customAxios
      .get("/reviews/user", { withCredentials: true })
      .then((response) => {
        if (response)
          setReviews(response.data.reviews.map(r => JSON.stringify(r)));
      });
  }, []);
  return (
    <>
    <div className="center-content">
      <div className="card">
        <div className="card-header">Reviews</div>
        <ul className="list-group list-group-flush">
          {reviews.map((item, index) => (
            <li className="list-group-item" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
  );
};
 
export default Reviews;




