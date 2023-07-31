import React, { useState, useContext } from "react";
import customAxios from "../services/api";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

const WriteReview = ({ hotelId, handleNewReview }) => {
  const { user, handleOpenLoginPopup } = useContext(AuthContext);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [selectedStars, setSelectedStars] = useState(0); 
  const maxReviewLength = 2000;

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (value.length <= maxReviewLength) {
      setReviewText(value);
    }
  };

  const handleShareReview = () => {
    if (reviewText.length > 10){
      if (selectedStars > 0){
        const reviewData = {
          text: reviewText,
          hotelId: hotelId,
          stars: selectedStars,
          date: new Date().toISOString(),
        };

        customAxios
          .post(`/reviews`, reviewData, { withCredentials: true })
          .then((response) => {
            if (response.status === 200)
              handleNewReview();
              setReviewStatus("Review posted successfully!");
              setReviewText("");
              setSelectedStars(0);
              setTimeout(() => setReviewStatus(""), 3000);
          })
          .catch((error) => {
            setReviewStatus("Error posting review! Please try again.")
            setTimeout(() => setReviewStatus(""), 3000);
            console.error("Error posting review:", error);
          });
      } else {
        setReviewStatus("You haven't selected any stars.")
        setTimeout(() => setReviewStatus(""), 3000);
      }
    } else {
      setReviewStatus("Your review is too short.")
      setTimeout(() => setReviewStatus(""), 3000);
    }
  };

  const handleStarClick = (numberOfStars) => {
    setSelectedStars(numberOfStars);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i < 6; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          style={{ cursor: "pointer", fontSize: 14.5, color: i <= selectedStars ? "#edbc40" : "#bbbbbb" }}>
          <FontAwesomeIcon icon={i <= selectedStars ? solidStar : regularStar} />
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container-spaced">
      <textarea
        value={reviewText}
        onChange={handleInputChange}
        placeholder="Write your review here..."
        style={{
          resize: "vertical",
          height: "50px",
          width: "80%",
          fontSize: 15,
          font: "inherit",
          padding: 30,
          outline: "none",
          lineHeight: 1.3
        }}
        className="card card-body"
      />
      <div className="centered-text" style={{ width: "20%", padding: 10, paddingTop: 20 }}>
        {/* <p>{reviewText.length}/{maxReviewLength}</p> */}
        <div>{renderStars()}</div>
        <button className="button" style={{ paddingInline: 25, marginTop: 10 }} onClick={user ? handleShareReview : handleOpenLoginPopup}>Share</button>
        <div className="warning">{reviewStatus && `${reviewStatus}`}</div>
      </div>
    </div>
  );
};

export default WriteReview;
