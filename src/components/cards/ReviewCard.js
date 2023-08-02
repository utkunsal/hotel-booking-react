import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import customAxios from "../../services/api";


const ReviewCard = ({ review, includeHotelName, handleDeleteReview }) => {
  const [deleteStatus, setDeleteStatus] = useState("");
  const stars = [];

  for (let i = 0; i < review.stars; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="filled-star" />);
  }

  for (let i = review.stars; i < 5; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="empty-star" />);
  }

  const handleDelete = () => {
    customAxios
      .delete(`/reviews/${review.id}`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          handleDeleteReview();
          setDeleteStatus("");
        } 
      })
      .catch((err) => {
        setDeleteStatus("Failed. Please try again.");
        setTimeout(() => setDeleteStatus(""), 3000);
      });
  }

  return (
    <div className="card">
      <div className="card-header">
        {includeHotelName && <div>{review.hotelName}</div>}
        <div>
          {review.userDisplayName} - {stars}
        </div>
      </div>
      <div className="card-body" style={{ borderRadius: 0 }}>
        <div className="card-text">{review.text}</div>
      </div>
      <div className="card-footer" style={{paddingBottom: 10}}>{new Date(review.date)
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        { includeHotelName && <button className="cancel-button" style={{marginLeft: 30}} onClick={handleDelete}>Delete</button>}
        {deleteStatus && includeHotelName && <div className="warning">{deleteStatus}</div>}
      </div>
    </div>
  );
};

export default ReviewCard;