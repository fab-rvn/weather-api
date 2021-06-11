import React, { useEffect, useState } from 'react';
import './App.scss';
import PressureIcon from './assets/wi-barometer.svg';
import HumidityIcon from './assets/wi-humidity.svg';
import WindIcon from './assets/wi-strong-wind.svg';
import MinTempIcon from './assets/wi-thermometer-exterior.svg';
import MaxTempIcon from './assets/wi-thermometer.svg';
import Details from './components/Details';
import { formatTemp } from './helpers';

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
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
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
            {formatTemp(apiData.main.temp)}°<span>C</span>
          </p>
        </div>
        <div className="weather--container--info">
          <Details
            icon={MinTempIcon}
            data={formatTemp(apiData.main.temp_min)}
            simbol="°C"
          />
          <Details
            icon={MaxTempIcon}
            data={formatTemp(apiData.main.temp_max)}
            simbol="°C"
          />

          <Details icon={WindIcon} data={apiData.wind.speed} simbol="m/s" />
          <Details
            icon={HumidityIcon}
            data={apiData.main.humidity}
            simbol="%"
          />
          <Details
            icon={PressureIcon}
            data={apiData.main.pressure}
            simbol="hPa"
          />
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
