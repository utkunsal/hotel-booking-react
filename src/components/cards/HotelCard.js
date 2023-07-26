import React from "react";


const HotelCard = ({ payload, durationInDays }) => {
  
  return (
    <div className="card container-spaced" style={{height: 200}}>
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
            <div style={{fontSize: 13, color: "#666666"}}>{payload.hotel.city}, {payload.hotel.country}</div>
            <div style={{fontSize: 14.4}}>Rating {payload.avgRating == null ? "-" : payload.avgRating}/5</div>
            {payload.reviewCount === 0 ? <div style={{fontSize: 12}}>no reviews yet</div>:
            <div style={{fontSize: 12}}>{payload.reviewCount} review{payload.reviewCount !== 1 && "s"}</div>
            }
          </div>
          <div className="card-details">
            <div style={{ fontSize: 21, color: "darkred" }}>{payload.rooms[0].price * durationInDays}$</div>
            <div style={{fontSize: 14}}>for {durationInDays} night{durationInDays !== 1 && "s"}</div>
            <div style={{fontSize: 12, color: "#666666"}}>{payload.rooms.length} room{payload.rooms.length !== 1 && "s"} available</div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default HotelCard;