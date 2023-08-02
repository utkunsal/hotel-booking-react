import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import customAxios from "../services/api";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HotelCard from "../components/cards/HotelCard";
import { useSearchParams } from "react-router-dom";
import SearchForm from "../components/forms/SearchForm";
import MyMap from "../components/MyMap";

const Search = () => {
  const [locations, setLocations] = useState([]);  
  const [results, setResults] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(false);
  const [done, setDone] = useState();
  const startDate = useRef(searchParams.has("startDate") ? new Date(searchParams.get("startDate")) : new Date());
  const endDate = useRef(searchParams.has("endDate") ? new Date(searchParams.get("endDate")) : null);
  const capacity = useRef(searchParams.has("capacity") ? parseInt(searchParams.get("capacity")) : 2);
  const currentPage = useRef(searchParams.has("page") ? parseInt(searchParams.get("page")) : 0);
  const totalPages = useRef(0);
  const totalResults = useRef(0);
  const elementRefToScroll = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState()
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
            setDone(true)
        }} else {
          setResults([]);
          setDone(false)
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    performSearch();
  }, [searchParams])

  useLayoutEffect(() => {
    if (results.length !== 0)
      elementRefToScroll.current.scrollIntoView({ behavior: 'smooth' }); 
  }, [results])

  const handleSearch = () => {
    if(endDate.current == null){
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
        startDate: (new Date(startDate.current.getTime() - tzoffset)).toISOString().slice(0,10),
        endDate: (new Date(endDate.current.getTime() - tzoffset)).toISOString().slice(0,10),
        capacity: capacity.current,
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
      return <p className="centered-text">No hotels found.</p>;
    }
    return (
      <>
        <div style={{fontSize: 13}}>
        {totalResults.current} hotel{totalResults.current !== 1 && "s"} found. Showing {currentPage.current*10+1}-{Math.min((currentPage.current+1)*10,totalResults.current)}.
        </div>
          <ul>
            {results.map((result) => (
              <li key={result.hotel.id}>
                <HotelCard payload={result} startDate={startDate.current} endDate={endDate.current} capacity={capacity.current} />
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
      </>
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }

  const handleStartDateChange = (date) => {
    if (endDate.current && (endDate.current < date)){
      endDate.current = date
    }
    startDate.current = date
    setRefresh(!refresh)
  }

  const handleEndDateChange = (date) => {
    endDate.current = date
    setRefresh(!refresh)
  }

  const handleCapacityChange = (newCapacity) => {
    capacity.current = newCapacity
  }


  return (
    <>
      <div className="container card card-body" style={{padding: 0, marginBottom: 30}}>
        <p className="centered-text">Find Your Dream Hotel.</p>
        
        <SearchForm 
          locations={locations}
          selectedLocation={selectedLocation}
          startDate={startDate.current}
          endDate={endDate.current} 
          capacity={capacity.current}
          handleLocationChange={handleLocationChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          handleCapacityChange={handleCapacityChange}
        />

        <div className="btn-container">
          <button className="button" onClick={handleSearch}>Search</button>
          <div ref={elementRefToScroll} className="warning">{showWarning && "Plase Select a Check-out Date!"}</div>
        </div>
      </div>
      {done ? 
        renderResults() 
      :
        <div>
          <MyMap 
            locations={locations}
            selectedLocation={selectedLocation}
            handleLocationChange={handleLocationChange}
          />
        </div>
       }
    </>
  );
};

export default Search;