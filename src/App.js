import React, { useEffect, useState } from 'react';
import './App.css';
import icons from './Icons';

function App() {
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      const BASE_URL = 'http://api.openweathermap.org/data/2.5';

      navigator.geolocation.getCurrentPosition(position => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });

      let url = `${BASE_URL}/weather?q=Barcelona&appid=${process.env.REACT_APP_API_KEY}`;

      // if ('geolocation' in navigator) {
      //   url = `${BASE_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.REACT_APP_API_KEY}`;
      // }
      // url = `${BASE_URL}/weather?q=London,uk&appid=${process.env.REACT_APP_API_KEY}`;

      await fetch(url)
        .then(res => res.json())
        .then(result => {
          setApiData(result);
        });
    };
    fetchApi();
  }, [coords.latitude, coords.longitude]);

  // const type = apiData.weather[0].description | null;

  return apiData.weather ? (
    <div className="container">
      <div className="location text-center">
        <p>{`${apiData.name}, ${apiData.sys.country}`}</p>
      </div>
      <div className="notification">
        <p className="text-center"></p>
      </div>
      <div className="weather-container">
        <div className="weather-icon">
          {apiData.weather && (
            <img
              src={icons[`${apiData.weather[0].description}`]}
              alt="weather"
            />
          )}
        </div>
        <div className="temperature-value text-center">
          <p>
            {Math.floor(apiData.main.temp) - 273}°<span>C</span>
          </p>
        </div>
        <div className="temperature-description text-center">
          <p>{apiData.weather[0].description}</p>
        </div>
      </div>
    </div>
  ) : (
    <p>Fetching</p>
  );
}

export default App;
