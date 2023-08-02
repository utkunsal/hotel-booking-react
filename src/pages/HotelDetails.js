import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import customAxios from "../services/api";
import Reviews from "./Reviews";
import RoomCard from "../components/cards/RoomCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import WriteReview from "../components/WriteReview";
import SearchForm from "../components/forms/SearchForm";

const HotelDetails = () => {
  const location = useLocation();
  const [hotelWithRooms, setHotelWithRooms] = useState({});
  const startDate = useRef()
  const endDate = useRef()
  const capacity = useRef()
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const amountToGoBack = useRef(0);
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const hotelId = location?.pathname.split("/")[2];

  useEffect(() => {
    const getResults = async () => {
      startDate.current = new Date(searchParams.get("startDate"));
      endDate.current = new Date(searchParams.get("endDate"));
      capacity.current = searchParams.get("capacity");
      const response = await customAxios.get(`/hotels/${hotelId}?${searchParams.toString()}`, { withCredentials: true })
      setHotelWithRooms(response.data);
    }
    getResults();
    amountToGoBack.current -= 1;
  }, [searchParams, hotelId])

  const handleGoBack = () => {
    navigate(amountToGoBack.current); 
  };

  const handleStartDateChange = (date) => {
    const params = new URLSearchParams(searchParams); 
    if (endDate.current && (endDate.current < date)){
      params.set('endDate', (new Date(date.getTime() - tzoffset)).toISOString().slice(0,10));
    }
    params.set('startDate', (new Date(date.getTime() - tzoffset)).toISOString().slice(0,10));
    setSearchParams(params);
  };

  const handleEndDateChange = (date) => {
    const params = new URLSearchParams(searchParams); 
    params.set('endDate', (new Date(date.getTime() - tzoffset)).toISOString().slice(0,10));
    setSearchParams(params);
  };

  const handleCapacityChange = (capacity) => {
    const params = new URLSearchParams(searchParams); 
    params.set('capacity', capacity);
    setSearchParams(params);
  };

  const handleNewReview = () => {
    setRefresh(!refresh);
  }

  return (
    <>
      <button className="back-button" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faChevronLeft}/>
      </button>
      {hotelWithRooms.hotel && (
        <>
          <div className="card">
            <img src={hotelWithRooms.hotel.imageUrls[0]} style={{ 
                    width: "100%", 
                    height: 500,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
            }} alt="Hotel" />          
            <div className="card-body container-spaced" style={{borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: 30}}>
              <div style={{ width: "85%" }}>
                <div style={{fontSize: 22}}>{hotelWithRooms.hotel.name}</div>
                <div style={{fontSize: 19, color: "#666666"}}>{hotelWithRooms.hotel.city}, {hotelWithRooms.hotel.country}</div>
                <div style={{fontSize: 16, color: "#666666", padding: 20}}>{hotelWithRooms.hotel.description}</div>
              </div>
              <div className="card-details" style={{width: "15%"}}>
                <div style={{fontSize: 15}}>Rating</div>
                <div style={{ fontSize: '23px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '5px' }}>&#11089;</span>
                  {hotelWithRooms.avgRating == null ? "-" : hotelWithRooms.avgRating}/5
                </div>                  
                {hotelWithRooms.reviewCount === 0 ? <div style={{fontSize: 13}}>no reviews yet</div>:
                <div style={{fontSize: 13}}>{hotelWithRooms.reviewCount} review{hotelWithRooms.reviewCount !== 1 && "s"}</div>
                }
              </div>
            </div>
          </div>

          <p className="center-content" style={{fontSize: 18, paddingTop: 30, paddingBottom: 10}}>Choose your room</p>

          <SearchForm 
            startDate={startDate.current}
            endDate={endDate.current} 
            capacity={capacity.current}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            handleCapacityChange={handleCapacityChange}
          />

          { hotelWithRooms.rooms.length === 0 ? 
            (<p style={{fontSize: 16, color:"#606060", textAlign: "center", padding: 60}}>No available rooms found</p>)
            :
            (<>
              <ul>
                {hotelWithRooms.rooms.map((room, index) => (
                  <li key={room.id}>
                    <RoomCard payload={room} startDate={startDate.current} endDate={endDate.current} index={index + 1} includeHotel={false} />
                  </li>
                ))}
              </ul>
            </>)}
  
          <>
            <p className="center-content" style={{fontSize: 18, paddingTop: 30, paddingBottom: 10}}>Reviews of {hotelWithRooms.hotel.name}</p>
            <WriteReview hotelId={hotelWithRooms.hotel.id} handleNewReview={handleNewReview}/>
            <Reviews source={hotelWithRooms.hotel.id} size={3} includeHotelName={false} refresh={refresh}/>
          </>

        </>
      )}
    </>
  );
};

export default HotelDetails;