import React, { useEffect, useState } from 'react';
import './App.css';

interface IWeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: string;
    sunset: string;
  };
  weather: weather[];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
}

type weather = {
  icon: string;
  description: string;
};

function App() {
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [apiData, setApiData] = useState<IWeatherData>();

  useEffect(() => {
    const fetchApi = async () => {
      const BASE_URL = 'http://api.openweathermap.org/data/2.5';

      navigator.geolocation.getCurrentPosition(position => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });

      let url = `${BASE_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.REACT_APP_API_KEY}`;

      await fetch(url)
        .then(res => res.json())
        .then(result => {
          setApiData(result);
        });
    };
    fetchApi();
  }, [coords.latitude, coords.longitude]);

  return apiData?.weather ? (
    <div className="container">
      <div className="location text-center">
        <p>{`${apiData.name}, ${apiData.sys.country}`}</p>
        <p>{apiData.sys.sunrise}</p>
        <p>{apiData.sys.sunset}</p>
      </div>
      <div className="weather-container">
        <div className="weather-icon">
          <img
            src={`http://openweathermap.org/img/wn/${apiData.weather[0].icon}@4x.png`}
            alt="weather"
          />
        </div>
        <div className="temperature-description text-center">
          <p>{apiData.weather[0].description}</p>
        </div>
        <div className="temperature-value text-center">
          <p>
            {Math.floor(apiData.main.temp) - 273}°<span>C</span>
          </p>
          <span>
            <span>Min </span>
            {Math.floor(apiData.main.temp_min - 273)}°<span>C</span>
          </span>
          <span>
            <span>Max </span>
            {Math.floor(apiData.main.temp_max - 273)}°<span>C</span>
          </span>
          <span>{apiData.main.humidity}%</span>
        </div>
      </div>
    </div>
  ) : (
    <p>Fetching</p>
  );
}

export default App;
