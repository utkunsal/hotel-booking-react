import { useEffect, useState, useRef, useLayoutEffect } from "react";
import customAxios from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import RoomCard from "../components/cards/RoomCard";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = useRef(0);
  const totalResults = useRef(0);
  const size = 10;

  useEffect(() => {
    const fetchReviews = () => {
      customAxios
        .get(`/bookings/user?page=${currentPage}&size=${size}`, { withCredentials: true })
        .then((response) => {
          if (response) {
            setBookings(response.data.bookings);
            totalPages.current = response.data.totalPages
            totalResults.current = response.data.totalItems
          }
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
        });
    };
    fetchReviews();
  }, [currentPage]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left:0 , behavior: "smooth" })
  }, [bookings])

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="center-content">
      {totalResults.current > 0 ? 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{fontSize: 13,  paddingTop: 20}}>
            {totalResults.current} booking{totalResults.current !== 1 && "s"}. Showing {currentPage*size+1}-{Math.min((currentPage+1)*size,totalResults.current)}.
          </div>
          <div>
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <RoomCard 
                    payload={booking.room} 
                    startDate={new Date(booking.startDate)} 
                    endDate={new Date(booking.endDate)} 
                    index={booking.room.number} 
                    includeHotelName={true}
                    id={booking.id}
                  />
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
        </div>
      :
      <div style={{fontSize: 13}}>
        You don't have any bookings yet. Start exploring and make your first booking today!
      </div>
      }
    </div>
  );
};

export default Bookings;
