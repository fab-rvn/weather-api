// REFERENCE
const iconElement = document.querySelector(".weather-icon");
const temperatureElement = document.querySelector(".temperature-value p");
const descriptionElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location");
const notificationElement = document.querySelector(".notification");


const weather = {};
weather.temperature = {
  unit: "celsius"
}

const KELVIN = 273;
const key = "";

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Broweser dont support the geolocation</p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML =   `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  
  fetch(api)
    .then (function(response) {
      let data = response.json();
      return data;
    })
    .then (function(data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then (function() {
      displayWeather();
    })
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  temperatureElement.innerHTML = `<p>${weather.temperature.value}°<span>C</span></p>`;
  descriptionElement.innerHTML = weather.description;
  locationElement.innerHTML = `<p>${weather.city}, ${weather.country}</p>`;
}

function celsiusToFahrenheit(temperature) {
  return (temperature * 9/5) + 32;
}

temperatureElement.addEventListener("click", function() {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);

    temperatureElement.innerHTML = `${fahrenheit}°<span>F</span></p>`;
    weather.temperature.unit = "fahrenheit";

  } else {
    temperatureElement.innerHTML = `<p>${weather.temperature.value}°<span>C</span></p>`;
    weather.temperature.unit = "celsius";
  }
})
