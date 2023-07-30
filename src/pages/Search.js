import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import customAxios from "../services/api";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HotelCard from "../components/cards/HotelCard";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(null); 
  const [capacity, setCapacity] = useState(2); 
  const [results, setResults] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useRef(0);
  const totalPages = useRef(0);
  const totalResults = useRef(0);
  const elementRefToScroll = useRef(null);
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;

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
    if (searchParams.has("startDate") && searchParams.has("endDate") && searchParams.has("capacity")){
      setStartDate(new Date(searchParams.get("startDate")));
      setEndDate(new Date(searchParams.get("endDate")));
      setCapacity(searchParams.get("capacity"));
      currentPage.current = searchParams.has("page") ? parseInt(searchParams.get("page")) : 0 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      try {
        if (searchParams.has("startDate") && searchParams.has("endDate") && searchParams.has("capacity")){
          const response = await customAxios.get(`/search?${searchParams.toString()}&size=10`, { withCredentials: true });
          if(response?.data){
            setResults(response.data.results)
            totalPages.current = response.data.totalPages
            totalResults.current = response.data.totalItems
        }} else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    performSearch();
  }, [searchParams])

  useLayoutEffect(() => {
    elementRefToScroll.current.scrollIntoView({ behavior: 'smooth' }); 
  }, [results])

  const handleSearch = () => {
    if(endDate == null){
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    } else {
      currentPage.current = 0;
      let params = {}
      if (selectedLocation) {
        if (selectedLocation.includes(",")) {
          const [city, country] = selectedLocation.split(", ");
          params = {city: city, country: country}
        } else {
          params = {country: selectedLocation}
        }
      }
      setSearchParams({
        ...params,
        startDate: (new Date(startDate.getTime() - tzoffset)).toISOString().slice(0,10),
        endDate: (new Date(endDate.getTime() - tzoffset)).toISOString().slice(0,10),
        capacity: capacity,
        page: currentPage.current,
      });
    }
  };

  const handleNextPage = () => {
    currentPage.current += 1;
    const params = new URLSearchParams(searchParams); 
    params.set('page', currentPage.current);
    setSearchParams(params);
  };

  const handlePrevPage = () => {
    currentPage.current -= 1;
    const params = new URLSearchParams(searchParams); 
    params.set('page', currentPage.current);
    setSearchParams(params);
  };

  const renderResults = () => {
    if (results.length === 0) {
      return <div>No hotels found.</div>;
    }
    return (
      <div>
        <div style={{fontSize: 13}}>
        {totalResults.current} hotel{totalResults.current !== 1 && "s"} found. Showing {currentPage.current*10+1}-{Math.min((currentPage.current+1)*10,totalResults.current)}.
        </div>
          <ul>
            {results.map((result) => (
              <li key={result.hotel.id}>
                <HotelCard payload={result} startDate={startDate} endDate={endDate} capacity={capacity} />
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
          <div className="centered-text">Welcome</div>
          <div className="center-content search-form">
            <div className="form-group">
              <label>Location</label>
              <Select
                options={locations.map(location => ({ value: location, label: location }))}
                onChange={selectedOption => setSelectedLocation(selectedOption?.value)}
                placeholder="Select a Location"
                theme={reactSelectTheme}
              />
            </div>
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
                dateFormat="MMMM d, yyyy"
                onChange={date => {
                  setStartDate(date);
                  if (endDate && (endDate < date)){
                    setEndDate(date);
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <DatePicker
                className="picker"
                placeholderText="Select a Date"
                selected={endDate && Math.max(startDate,endDate)}
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
                options={[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ value: n, label: n }))}
                onChange={selectedOption => setCapacity(selectedOption.value)}
                defaultValue={{ label: capacity, value: capacity }}
                theme={reactSelectTheme}
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

export default Search;


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