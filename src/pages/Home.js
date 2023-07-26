import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import customAxios from "../services/api";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HotelCard from "../components/cards/HotelCard";

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(null); 
  const [capacity, setCapacity] = useState("2"); 
  const [results, setResults] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const currentPage = useRef(0);
  const totalPages = useRef(0);
  const totalResults = useRef(0);
  const elementRefToScroll = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await customAxios.get("/hotels/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useLayoutEffect(() => {
    elementRefToScroll.current.scrollIntoView({ behavior: 'smooth' }); 
  }, [results])

  const handleSearch = () => {
    if(endDate == null){
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    } else {
      currentPage.current = 0;
      performSearch();
    }};

  const handleNextPage = () => {
    currentPage.current += 1;
    performSearch();
  };

  const handlePrevPage = () => {
    currentPage.current -= 1;
    performSearch();
  };

  const performSearch = async () => {
    try {
      let searchEndpoint = "/search?";
      if (selectedLocation) {
        if (selectedLocation.includes(",")) {
          const [city, country] = selectedLocation.split(", ");
          searchEndpoint += `city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&`;
        } else {
          searchEndpoint += `country=${encodeURIComponent(selectedLocation)}&`;
        }
      }
      if (startDate) {
        searchEndpoint += `startDate=${encodeURIComponent(startDate.toISOString().slice(0,10))}&`;
      }
      if (endDate) {
        searchEndpoint += `endDate=${encodeURIComponent(endDate.toISOString().slice(0,10))}&`;
      }
      if (capacity) {
        searchEndpoint += `capacity=${encodeURIComponent(capacity)}&`;
      }
      searchEndpoint += `page=${currentPage.current}&size=10`
      const response = await customAxios.get(searchEndpoint, { withCredentials: true });
      if(response){
        setResults(response.data.results)
        totalPages.current = response.data.totalPages
        totalResults.current = response.data.totalItems
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const getStayDuration = () => {
      const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      return Math.max(Math.ceil(durationInDays),1);
  };

  const renderResults = () => {
    if (results.length === 0) {
      return <div>No results found.</div>;
    }
    const durationInDays = getStayDuration();
    return (
      <div>
        <div style={{fontSize: 13}}>
        {totalResults.current} result{totalResults.current !== 1 && "s"} found. Showing {currentPage.current*10+1}-{Math.min(currentPage.current+1*10,totalResults.current)}.
        </div>
          <ul>
            {results.map((result) => (
              <li key={result.hotel.id}>
                <HotelCard payload={result} durationInDays={durationInDays} />
              </li>
            ))}
          </ul>
            <div className="btn-container-page">
            <button className="page-button" onClick={handlePrevPage} disabled={currentPage.current === 0}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div style={{padding: 10}}>{currentPage.current + 1}/{totalPages.current}</div>
            <button className="page-button" onClick={handleNextPage} disabled={currentPage.current >= totalPages.current - 1}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <div className="container">
          <div className="centered-text">
            Welcome
          </div>
          <div className="center-content search-form">
            <div className="form-group">
              <label>Location</label>
              <Select
                options={locations.map(location => ({ value: location, label: location }))}
                onChange={selectedOption => setSelectedLocation(selectedOption?.value)}
                placeholder="Select a Location"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 8,
                  colors: {
                    ...theme.colors,
                    primary25: "#ebebeb",
                    primary: "#fd6e46",
                  },
                })}
              />
            </div>
            <div className="form-group">
              <label>Check-in Date</label>
              <DatePicker
                filterDate={d => {
                  return d.getTime() >= new Date().getTime();
                }}
                className="picker"
                placeholderText="Select a Date"
                selected={startDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                dateFormat="MMMM d, yyyy"
                onChange={date => setStartDate(date)}
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
                onChange={date => setEndDate(date)}
              />
            </div>
            <div className="form-group">
              <label>Travellers</label>
              <Select
                options={[1, 2, 3, 4, 5, 6, 7, 8].map(location => ({ value: location, label: location }))}
                onChange={selectedOption => setCapacity(selectedOption.value)}
                defaultValue={{ label: 2, value: 0 }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 8,
                  colors: {
                    ...theme.colors,
                    primary25: "#ebebeb",
                    primary: "#fd6e46",
                  },
                })}
              />
            </div>
          </div>
          <div className="btn-container">
            <button className="button" onClick={handleSearch} >Search</button>
            <div ref={elementRefToScroll} className="warning">{showWarning && "Plase Select a Check-out Date!"}</div>
          </div>
        </div>
        {renderResults()}
      </div>
    </>
  );
};

export default Home;