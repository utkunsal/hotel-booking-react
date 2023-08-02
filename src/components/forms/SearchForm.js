import React from 'react';
import DatePicker from "react-datepicker";
import Select from 'react-select';

const SearchForm = ({ locations, selectedLocation, startDate, endDate, capacity, handleLocationChange, handleStartDateChange, handleEndDateChange, handleCapacityChange }) => {

    return(
        <div key={selectedLocation} className="center-content search-form">
            {locations && <div className="form-group">
              <label>Location</label>
              <Select
                options={locations.map(location => ({ value: location, label: location }))}
                onChange={selectedOption => handleLocationChange(selectedOption?.value)}
                placeholder="Select a Location"
                defaultValue={selectedLocation && { label: selectedLocation, value: selectedLocation }}
                theme={reactSelectTheme}
              />
            </div>}
            <div className="form-group">
              <label>Check-in Date</label>
              <DatePicker
                filterDate={d => {
                  return d.getTime() > new Date().getTime() - (1000 * 3600 * 24);
                }}
                className="picker"
                placeholderText="Select a Date"
                disabledKeyboardNavigation
                selected={startDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy"
                onChange={date => handleStartDateChange(date)}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <DatePicker
                className="picker"
                placeholderText="Select a Date"
                disabledKeyboardNavigation
                selected={endDate && Math.max(startDate,endDate)}
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
    )
}

export default SearchForm;

const reactSelectTheme = (theme) => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary25: "#ebebeb",
      primary50: "#dddddd",
      primary: "#bb3547",
    },
  })