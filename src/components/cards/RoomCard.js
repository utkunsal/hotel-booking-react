import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';


const RoomCard = ({ payload, startDate, endDate, index }) => {
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

  return (
    <div className="card" >
      <div className="card-body" >
        <div className="container-spaced" style={{padding: 20}}>
          <div style={{maxWidth: 550}}>
            <div style={{ fontSize: 14, marginBottom: 5 }}>Room {index}</div>
            <div style={{ fontSize: 14, color: "#606060", marginBottom: 5 }}>
              <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} style={{ marginRight: 5, fontSize: "11px" }} />
              {payload.size}
            </div>
            <div style={{ fontSize: 14, color: "#606060" }}>{amenitiesList}</div>
          </div>
          <div className="card-details">
            <div style={{ fontSize: 21, color: "darkred" }}>{payload.price * stayDuration}$</div>
            <div style={{fontSize: 14}}>{stayDuration} night{stayDuration !== 1 && "s"}</div>
            <div style={{ fontSize: 14, color: "#606060" }}>
              {payload.capacity} 
              <FontAwesomeIcon icon={faUser} style={{ marginLeft: 5 }} />
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default RoomCard;