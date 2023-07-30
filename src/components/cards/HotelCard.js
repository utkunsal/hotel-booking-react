import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
} from '@fortawesome/free-solid-svg-icons';


const HotelCard = ({ payload, startDate, endDate, capacity }) => {
  const navigate = useNavigate();
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const stayDuration = Math.max(Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),1);

  const handleClick = () => {
    const queryParams = new URLSearchParams({
      startDate: (new Date(startDate.getTime() - tzoffset)).toISOString().slice(0, 10),
      endDate: (new Date(endDate.getTime() - tzoffset)).toISOString().slice(0, 10),
      capacity: capacity,
    });
    navigate(`/hotels/${payload.hotel.id}?${queryParams.toString()}`);
  };
  
  return (
    <div className="card container-spaced" style={{height: 200}} onClick={handleClick}>
      <img src={payload.hotel.imageUrls[0]} style={{ 
        width: "55%", 
        height: undefined,
        objectFit: "cover",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
        }} alt="Hotel" />
      <div className="card-body" style={{width: "45%"}}>
        <div className="container-spaced" style={{padding: 20}}>
          <div>
            <div style={{fontSize: 20}}>{payload.hotel.name}</div>
            <div style={{fontSize: 14, color: "#666666"}}>{payload.hotel.city}, {payload.hotel.country}</div>
            <div style={{fontSize: 14.4, paddingTop: 10}}>Rating {payload.avgRating == null ? "-" : payload.avgRating}/5</div>
            {payload.reviewCount === 0 ? <div style={{fontSize: 12}}>no reviews yet</div>:
            <div style={{fontSize: 12}}>{payload.reviewCount} review{payload.reviewCount !== 1 && "s"}</div>
            }
          </div>
          <div className="card-details">
            <div style={{ fontSize: 21, color: "darkred" }}>{payload.rooms[0].price * stayDuration}$</div>
            <div style={{fontSize: 14}}>for {stayDuration} night{stayDuration !== 1 && "s"}</div>
            <div style={{ fontSize: 14, color: "#606060", padding: 3 }}>
              {capacity} 
              <FontAwesomeIcon icon={faUser} style={{ marginLeft: 5, fontSize: 12 }} />
            </div>
            <div style={{fontSize: 12, color: "#666666"}}>{payload.rooms.length} room option{payload.rooms.length !== 1 && "s"} available</div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default HotelCard;