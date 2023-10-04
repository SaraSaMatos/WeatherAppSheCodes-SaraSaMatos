function dateFormated(date) {
  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${currentHours}:${currentMinutes}`;
}
function fahrenheitUnitsChange(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#temperature");

  celsiusUnits.classList.remove("active");
  fahrenheitUnits.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}
function celsiusUnitsChange(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#temperature");

  fahrenheitUnits.classList.remove("active");
  celsiusUnits.classList.add("active");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitUnits = document.querySelector("#fahrenheit-unit");
fahrenheitUnits.addEventListener("click", fahrenheitUnitsChange);

let celsiusUnits = document.querySelector("#celsius-unit");
celsiusUnits.addEventListener("click", celsiusUnitsChange);

let actualDateInput = document.querySelector("#actualDate");
let currentDate = new Date();
actualDateInput.innerHTML = dateFormated(currentDate);

function search(city) {
  let key = "30010848d4a1co0dd7fd9fe7b1ee0a4t";
  let urlKey = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  axios.get(urlKey).then(showTemperature);
  console.log(urlKey);
}
function searchCity(event) {
  event.preventDefault();
  let searchCityInput = document.querySelector("#search-input");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${searchCityInput.value}`;
  search(searchCityInput.value);
}

let form = document.querySelector("#city-search");
form.addEventListener("submit", searchCity);

function showPosition(position) {
  let key = "30010848d4a1co0dd7fd9fe7b1ee0a4t";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let urlKey = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${key}&units=metric`;
  axios.get(urlKey).then(showTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showTemperature(response) {
  console.log(response);
  celsiusTemperature = response.data.temperature.current;

  let temperature = Math.round(response.data.temperature.current);
  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = `${temperature}`;

  let h1 = document.querySelector("h1");
  h1.innerHTML = `${response.data.city}`;

  let cityElement = document.querySelector("h1");
  cityElement.innerHTML = response.data.city;

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.condition.description;

  let windInfo = document.querySelector("#windValue");
  windInfo.innerHTML = `${Math.round(response.data.wind.speed)} m/sec`;

  let humidityInfo = document.querySelector("#humidityValue");
  humidityInfo.innerHTML = `${response.data.temperature.humidity} %`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let key = "30010848d4a1co0dd7fd9fe7b1ee0a4t";
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let urlKey = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&key=${key}&units=metric`;
  axios.get(urlKey).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` 
    <div class="col">
        <div class="card" style="margin-top: 0;">
          <p class="week-day">${formatDay(forecastDay.time)}.</br> </p>
          <img
            src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png"
            class="card-img-middle"
            alt="${forecastDay.condition.description}"
            width="42"
          />
           <div class="card-body">
              <p> <span class="max-temperature">${Math.round(
                forecastDay.temperature.maximum
              )} </span>| ${Math.round(forecastDay.temperature.minimum)} °C </p>
      <div class="forecast-weather-description"> ${
        forecastDay.condition.description
      }
      </div>
            </div>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

navigator.geolocation.getCurrentPosition(showPosition);

let currentPositionButton = document.querySelector(`#currentposition-button`);
currentPositionButton.addEventListener("click", getCurrentPosition);

displayForecast();
