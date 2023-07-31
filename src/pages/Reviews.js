import { useEffect, useState, useRef, useLayoutEffect } from "react";
import customAxios from "../services/api";
import ReviewCard from "../components/cards/ReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Reviews = ({ source, size, includeHotelName }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = useRef(0);
  const totalResults = useRef(0);
  const elementRefToScroll = useRef();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const fetchReviews = () => {
      customAxios
        .get(`/reviews/${source}?page=${currentPage}&size=${size}`, { withCredentials: true })
        .then((response) => {
          if (response) {
            setReviews(response.data.reviews);
            totalPages.current = response.data.totalPages
            totalResults.current = response.data.totalItems
          }
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    };
    fetchReviews();
  }, [currentPage, size, source]);

  useLayoutEffect(() => {
    if (!isFirstRenderRef.current) {
      source === 'user' ?
      window.scrollTo({ top: 0, left:0 , behavior: "smooth" }) : elementRefToScroll.current?.scrollIntoView({ behavior: 'smooth' }); 
    } else {
      isFirstRenderRef.current = reviews.length ? false : true;
    }
  }, [reviews, source])

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="center-content">
      {totalResults.current > 0 ? 
        <>
          <div ref={elementRefToScroll} style={{fontSize: 13, paddingTop: 20}}>
            {totalResults.current} review{totalResults.current !== 1 && "s"}. Showing {currentPage*size+1}-{Math.min((currentPage+1)*size,totalResults.current)}.
          </div>
          <div>
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} includeHotelName={includeHotelName} />
                </li>
              ))}
            </ul>
            <div className="btn-container-page">
              <button className="page-button" onClick={handlePrevPage} disabled={currentPage === 0}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <div style={{padding: 10}}>{currentPage + 1}/{totalPages.current}</div>
              <button className="page-button" onClick={handleNextPage} disabled={currentPage >= totalPages.current - 1}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </>
      :
      <div style={{fontSize: 13}}>
        You don't have any reviews yet.
      </div>
      }
    </div>
  );
};

export default Reviews;
