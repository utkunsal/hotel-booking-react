import { useEffect, useState } from "react";
import customAxios from "../services/api";
import ReviewCard from "../components/cards/ReviewCard";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchReviews = () => {
      customAxios
        .get(`/reviews/user?page=${currentPage}&size=2`, { withCredentials: true })
        .then((response) => {
          if (response) {
            setReviews((prevReviews) => [...prevReviews, ...response.data.reviews]);
            setTotalPages(response.data.totalPages);
          }
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    };

    fetchReviews();
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="center-content">
      <div>
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} includeHotelName={true} />
            </li>
          ))}
        </ul>
        {currentPage < totalPages - 1 && (
          <div className="btn-container">
            <button className="button" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
