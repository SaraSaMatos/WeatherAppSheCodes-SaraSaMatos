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
  let fahrenheitUnitsChangeInput = document.querySelector("#temperature");
  fahrenheitUnitsChangeInput.innerHTML = 75;
}
function celsiusUnitsChange(event) {
  event.preventDefault();
  let celsiusUnitsChangeInput = document.querySelector("#temperature");
  celsiusUnitsChangeInput.innerHTML = 24;
}

let fahrenheitUnits = document.querySelector("#fahrenheit-unit");
fahrenheitUnits.addEventListener("click", fahrenheitUnitsChange);

let celsiusUnits = document.querySelector("#celsius-unit");
celsiusUnits.addEventListener("click", celsiusUnitsChange);

let actualDateInput = document.querySelector("#actualDate");
let currentDate = new Date();
actualDateInput.innerHTML = dateFormated(currentDate);

function search(city) {
  let apiKey = "515c9ddbeb3cda9061acfab71031839e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  console.log(apiUrl);
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
  let key = "e450bc345a80a08ada69fd5c714d871d";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let urlKey = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  axios.get(urlKey).then(showTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showTemperature(response) {
  console.log(response);
  let temperature = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = `${temperature} ℃`;

  let h1 = document.querySelector("h1");
  h1.innerHTML = `${response.data.name}`;

  let cityElement = document.querySelector("h1");
  cityElement.innerHTML = response.data.name;

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let windInfo = document.querySelector("#windValue");
  windInfo.innerHTML = `${Math.round(response.data.wind.speed)} m/sec`;

  let humidityInfo = document.querySelector("#humidityValue");
  humidityInfo.innerHTML = `${response.data.main.humidity} %`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
navigator.geolocation.getCurrentPosition(showPosition);

let currentPositionButton = document.querySelector(`#currentposition-button`);
currentPositionButton.addEventListener("click", getCurrentPosition);
