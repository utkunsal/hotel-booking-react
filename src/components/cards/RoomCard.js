import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import customAxios from "../../services/api";
import { 
  faWifi, 
  faCoffee, 
  faTv, 
  faWineGlassAlt, 
  faSnowflake, 
  faShower, 
  faTree, 
  faVolumeXmark, 
  faCircle,
  faUser,
  faUpRightAndDownLeftFromCenter,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import AuthContext from "../../context/AuthContext";


const RoomCard = ({ payload, startDate, endDate, index, includeHotel, id }) => {
  const { user, handleOpenLoginPopup } = useContext(AuthContext);
  const [bookingId, setBookingId] = useState(id ? id : null);
  const [bookingStatus, setBookingStatus] = useState("");
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;

  const stayDuration = Math.max(Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),1);
  const amenityIcons = {
    "Air conditioning": faSnowflake,
    "Private Bathroom": faShower,
    "Flat-screen TV": faTv,
    "Soundproof": faVolumeXmark,
    "Coffee machine": faCoffee,
    "Minibar": faWineGlassAlt,
    "Free WiFi": faWifi,
    "Balcony": faTree,
  };

  const amenitiesList = payload.amenities.map(amenity => (
    <React.Fragment key={amenity}>
      <FontAwesomeIcon icon={amenityIcons[amenity]} style={{ marginRight: 5 }} />
      {amenity}
      {amenity !== payload.amenities[payload.amenities.length - 1] && (
        <FontAwesomeIcon icon={faCircle} style={{ margin: "3 11px", fontSize: "4px" }} />
      )}
    </React.Fragment>
  ));

  const handleBookRoom = () => {
    const bookingData = {
      roomId: payload.id,
      startDate: (new Date(startDate.getTime() - tzoffset)).toISOString().slice(0,10),
      endDate: (new Date(endDate.getTime() - tzoffset)).toISOString().slice(0,10),
    };

    customAxios
      .post(`/bookings`, bookingData, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setBookingId(response.data.id)
          setBookingStatus("");
        }
      })
      .catch(() => {
        setBookingStatus("Booking failed. Please refresh and try again.");
      });
  };

  const handleCancelBooking = () => {
    customAxios
      .delete(`/bookings/${bookingId}`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setBookingId(null)
          setBookingStatus("");
        } 
      })
      .catch(() => {
        setBookingStatus("Failed. Please try again.");
      });
  };

  return (
    <div className="card card-body">
        
        <div className="container-spaced" style={{padding: 20}}>

          {includeHotel &&
            <img src={payload.hotel.imageUrls[0]} style={{ 
            width: "20%", 
            height: undefined,
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            marginLeft: -30,
            marginTop: -30,
            marginBottom: -30,
            }} alt="Hotel" />
          }

          <div style={{width: "51%"}}>
            {includeHotel &&
              <>
                <div style={{fontSize: 20}}>{payload.hotel.name}</div>
                <div style={{fontSize: 16, color: "#666666", marginBottom: 10}}>{payload.hotel.city}, {payload.hotel.country}</div>
              </>
            }
            <div style={{ fontSize: 14, marginBottom: 8 }}>{id ? "Room" : "Room Option"} {index}</div>
            <div style={{ fontSize: 14, color: "#606060", marginBottom: 5 }}>
              <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} style={{ marginRight: 5, fontSize: "11px" }} />
              {payload.size}
            </div>
            <div style={{ fontSize: 14, color: "#505050", lineHeight: 1.8 }}>{amenitiesList}</div>
          </div>
          <div className="card-details" style={{width: "29%"}}>
            {includeHotel && 
              <div>{startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })} to {endDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            }
            <div style={{ fontSize: 21, color: "darkred" }}>{payload.price * stayDuration}$</div>
            <div style={{fontSize: 14}}>{stayDuration} night{stayDuration !== 1 && "s"}</div>
            <div style={{ fontSize: 14, color: "#606060" }}>
              {payload.capacity} 
              <FontAwesomeIcon icon={faUser} style={{ marginLeft: 5 }} />
            </div>
            {!bookingId ? 
            <button className="book-button" onClick={user ? handleBookRoom : handleOpenLoginPopup}>
              Book
            </button>
            :
            <>
              <div style={{fontSize: 15, color: "green", marginTop: 13, marginRight: 4.5}}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: 5 }} />
                Booked
              </div>
              {startDate.getTime() > new Date().getTime() - (1000 * 3600 * 24) && <button className="cancel-button" onClick={handleCancelBooking}>
                Cancel
              </button>}
            </>
            }
            {bookingStatus && <div className="warning" >{bookingStatus}</div>}
          </div>
        </div> 
    </div>
  );
};

export default RoomCard;