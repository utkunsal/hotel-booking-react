import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import customAxios from "../services/api";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import Reviews from "./Reviews";
import RoomCard from "../components/cards/RoomCard";

const HotelDetails = () => {
  const location = useLocation();
  const [hotelWithRooms, setHotelWithRooms] = useState({});
  const [startDate, setStartDate] = useState(); 
  const [endDate, setEndDate] = useState(); 
  const [capacity, setCapacity] = useState(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;

  useEffect(() => {
    const getResults = async () => {
      setStartDate(new Date(searchParams.get("startDate")));
      setEndDate(new Date(searchParams.get("endDate")));
      setCapacity(searchParams.get("capacity"));
      const hotelId = location?.pathname.split("/")[2];
      const response = await customAxios.get(`/hotels/${hotelId}?${searchParams.toString()}`, { withCredentials: true })
      setHotelWithRooms(response.data);
    }
    getResults();
  }, [location?.pathname, searchParams])

  /* const getStayDuration = () => {
    const durationInDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    return Math.max(Math.ceil(durationInDays),1);
  };
  const stayDuration = getStayDuration(); */

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleStartDateChange = (date) => {
    setStartDate(date)
    const params = new URLSearchParams(searchParams); 
    params.set('startDate', (new Date(startDate.getTime() - tzoffset)).toISOString().slice(0,10));
    setSearchParams(params);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date)
    const params = new URLSearchParams(searchParams); 
    params.set('endDate', (new Date(endDate.getTime() - tzoffset)).toISOString().slice(0,10));
    setSearchParams(params);
  };

  const handleCapacityChange = (capacity) => {
    setCapacity(capacity)
    const params = new URLSearchParams(searchParams); 
    params.set('capacity', capacity);
    setSearchParams(params);
  };

  return (
    <div>
      <button onClick={handleGoBack} style={{
        position: "fixed",
        top: "5%",
        left: "5%",
        }}>
        Go Back
      </button>

      {hotelWithRooms.hotel && (
        <div>
          <div className="card">
            <img src={hotelWithRooms.hotel.imageUrls[0]} style={{ 
                    width: "100%", 
                    height: 500,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
            }} alt="Hotel" />          
            <div className="card-body" style={{borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
              <div className="container-spaced" style={{padding: 20}}>
                <div>
                  <div style={{fontSize: 22}}>{hotelWithRooms.hotel.name}</div>
                  <div style={{fontSize: 19, color: "#666666"}}>{hotelWithRooms.hotel.city}, {hotelWithRooms.hotel.country}</div>
                </div>
                <div className="card-details">
                  <div style={{fontSize: 15}}>Rating</div>
                  <div style={{fontSize: 23}}>{hotelWithRooms.avgRating == null ? "-" : hotelWithRooms.avgRating}/5</div>
                  {hotelWithRooms.reviewCount === 0 ? <div style={{fontSize: 15}}>no reviews yet</div>:
                  <div style={{fontSize: 13}}>{hotelWithRooms.reviewCount} review{hotelWithRooms.reviewCount !== 1 && "s"}</div>
                  }
                </div>
              </div> 

            </div>
          </div>

          <div className="center-content search-form">
            <div className="form-group">
              <label>Check-in Date</label>
              <DatePicker
                filterDate={d => {
                  return d.getTime() > new Date().getTime() - (1000 * 3600 * 24);
                }}
                className="picker"
                placeholderText="Select a Date"
                selected={startDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                dateFormat="MMMM d, yyyy"
                onChange={date => handleStartDateChange(date)}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <DatePicker
                className="picker"
                placeholderText="Select a Date"
                selected={endDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate} 
                dateFormat="MMMM d, yyyy"
                onChange={date => handleEndDateChange(date)}
              />
            </div>
            <div className="form-group">
              <label>Travellers</label>
              <Select
                options={[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ value: n, label: n }))}
                onChange={selectedOption => handleCapacityChange(selectedOption.value)}
                defaultValue={{ label: capacity, value: capacity }}
                theme={reactSelectTheme}
              />
            </div>
          </div>

          { hotelWithRooms.rooms.length === 0 ? 
            (<div style={{fontSize: 16, color:"#606060", textAlign: "center", padding: 70}}>No available rooms found</div>)
            :
            (<div>
              {/* <div style={{fontSize: 16, color:"#606060"}}>Choose your room</div> */}
              <ul>
                {hotelWithRooms.rooms.map((room, index) => (
                  <li key={room.id}>
                    <RoomCard payload={room} startDate={startDate} endDate={endDate} index={index + 1} />
                  </li>
                ))}
              </ul>
            </div>)}
  
          <div>
            <Reviews source={hotelWithRooms.hotel.id} size={2} includeHotelName={false}/>
          </div>

        </div>
      )}
    </div>
  );
};

export default HotelDetails;


const reactSelectTheme = (theme) => ({
  ...theme,
  borderRadius: 8,
  colors: {
    ...theme.colors,
    primary25: "#ebebeb",
    primary50: "#dddddd",
    primary: "#fd6e46",
  },
})