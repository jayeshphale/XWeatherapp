// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

// SearchBar Component: Handles user input and triggers search
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState(""); // State to store the city name input

  // Function to handle search button click
  const handleSearch = () => {
    onSearch(city);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

// WeatherCard Component: Displays weather details
const WeatherCard = ({ title, data }) => {
  return (
    <div className="weather-card">
      <h3>{title}</h3>
      <p>{data}</p>
    </div>
  );
};

// WeatherDisplay Component: Fetches and displays weather data
const WeatherDisplay = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null); // State to store weather data
  const [loading, setLoading] = useState(false); // State to handle loading status

  // Fetch weather data whenever the city changes
  useEffect(() => {
    if (city) {
      setLoading(true);
      axios
        .get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: "cf6cae627141447e9e6113102230410", // API key (move to .env for security)
            q: city,
          },
        })
        .then((response) => {
          setWeatherData(response.data); // Store fetched data
        })
        .catch((error) => {
          console.error("Error fetching data");
          alert("Failed to fetch weather data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [city]);

  return (
    <div className="weather-display">
      {loading && <p>Loading data...</p>}
      {!loading && weatherData && (
        <div className="weather-cards">
          <WeatherCard title="Temperature" data={`${weatherData.current.temp_c}°C`} />
          <WeatherCard title="Humidity" data={`${weatherData.current.humidity}%`} />
          <WeatherCard title="Condition" data={weatherData.current.condition.text} />
          <WeatherCard title="Wind Speed" data={`${weatherData.current.wind_kph} kph`} />
        </div>
      )}
    </div>
  );
};

// Main Weather Component: Combines SearchBar and WeatherDisplay
function Weather() {
  const [city, setCity] = useState(""); // State to track the city entered by user

  // Function to update city state when search is triggered
  const handleSearch = (searchCity) => {
    setCity(searchCity);
  };

  return (
    <div className="Weather">
      <SearchBar onSearch={handleSearch} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default Weather;
