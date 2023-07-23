import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";


const ReviewCard = ({ review, includeHotelName }) => {
  const stars = [];

  for (let i = 0; i < review.stars; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="filled-star" />);
  }

  for (let i = review.stars; i < 5; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="empty-star" />);
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {includeHotelName && <div className="card-text">{review.hotelName}</div>}
        <div>
          {review.userDisplayName} - {stars}
        </div>
      </div>
      <div className="card-body">
        <p className="card-text">{review.text}</p>
      </div>
      <div className="card-footer">{new Date(review.date)
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  );
};

export default ReviewCard;