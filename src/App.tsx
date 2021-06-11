import React, { useEffect, useState } from 'react';
import './App.scss';

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
    <div className="weather">
      <div className="weather--location">
        <p>{`${apiData.name}, ${apiData.sys.country}`}</p>
      </div>
      <div className="weather--container">
        <div className="weather--container--icon">
          <img
            src={`http://openweathermap.org/img/wn/${apiData.weather[0].icon}@4x.png`}
            alt="weather"
          />
        </div>
        <div className="weather--container--description">
          <p>{apiData.weather[0].description}</p>
        </div>
        <div className="weather--container--temperature">
          <p>
            {Math.floor(apiData.main.temp) - 273}°<span>C</span>
          </p>
        </div>
        <div className="weather--container--info">
          <div>
            <p>Min</p>
            <p className="weather--container--info-value">
              {Math.floor(apiData.main.temp_min - 273)}°<span>C</span>
            </p>
          </div>
          <div>
            <p>Max</p>
            <p className="weather--container--info-value">
              {Math.floor(apiData.main.temp_max - 273)}°<span>C</span>
            </p>
          </div>
          <div>
            <p>Humidity</p>
            <p className="weather--container--info-value">
              {apiData.main.humidity}
              <span>%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>
      You'll need to enable the geolocation in order to get the current weather
      for you position
    </p>
  );
}

export default App;
