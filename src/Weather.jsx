import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

// Component: SearchBar - Handles user input and triggers search
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  // Function to handle the search button click
  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
    } else {
      alert("Please enter a city name");
    }
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

// Component: WeatherCard - Displays weather information
const WeatherCard = ({ title, data }) => {
  return (
    <div className="weather-card">
      <h3>{title}</h3>
      <p>{data}</p>
    </div>
  );
};

// Component: WeatherDisplay - Fetches and displays weather data
const WeatherDisplay = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError("");
      axios
        .get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: process.env.REACT_APP_WEATHER_API_KEY, // Use an environment variable for security
            q: city
          }
        })
        .then((response) => {
          setWeatherData(response.data);
        })
        .catch((error) => {
          setError("Failed to fetch weather data. Please check the city name.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [city]);

  return (
    <div className="weather-display">
      {loading && <p>Loading data...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && weatherData && !error && (
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

// Component: Weather - Main component that combines search and display
function Weather() {
  const [city, setCity] = useState("");

  // Function to handle search from SearchBar component
  const handleSearch = (searchCity) => {
    setCity(searchCity);
  };

  return (
    <div className="Weather">
      <h1>Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default Weather;
