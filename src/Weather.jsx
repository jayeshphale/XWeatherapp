import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

// SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

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

// WeatherCard Component
const WeatherCard = ({ title, data }) => (
  <div className="weather-card">
    <h3>{title}</h3>
    <p>{data}</p>
  </div>
);

// WeatherDisplay Component
const WeatherDisplay = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError("");
      setWeatherData(null); // Reset previous data

      axios
        .get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: process.env.REACT_APP_WEATHER_API_KEY,
            q: city,
          },
        })
        .then((response) => {
          setWeatherData(response.data);
        })
        .catch(() => {
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

// Main Weather Component
function Weather() {
  const [city, setCity] = useState("");

  return (
    <div className="Weather">
      <h1>Weather App</h1>
      <SearchBar onSearch={setCity} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default Weather;
