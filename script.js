const WEATHER_KEY = "PUT_YOUR_OPENWEATHERMAP_API_KEY_HERE";

let currentWeatherText = "";
let currentCity = "";

async function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city name");
  fetchWeather(`q=${city}`);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
    },
    () => alert("Location permission denied")
  );
}

async function fetchWeather(query) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${WEATHER_KEY}`
  );
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found");
    return;
  }

  currentCity = data.name;
  currentWeatherText = `
Temperature ${data.main.temp}°C,
Feels like ${data.main.feels_like}°C,
Humidity ${data.main.humidity}%,
Wind ${data.wind.speed} km/h,
Condition ${data.weather[0].description}
`;

  document.getElementById("weatherResult").classList.remove("hidden");
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
  document.getElementById("condition").innerText = data.weather[0].description;
  document.getElementById("feels").innerText = `Feels ${data.main.feels_like}°C`;
  document.getElementById("humidity").innerText = `Humidity ${data.main.humidity}%`;
  document.getElementById("wind").innerText = `Wind ${data.wind.speed} km/h`;

  setWeatherBackground(data.weather[0].main.toLowerCase());
}

function saveFavorite() {
  if (!currentCity) return;
  localStorage.setItem("favoriteCity", currentCity);
  alert("Favorite saved ⭐");
}

function enableAlerts() {
  Notification.requestPermission().then(p => {
    if (p === "granted") {
      new Notification("Weather alerts enabled 🌦️");
    }
  });
}

function runAI() {
  if (!currentWeatherText) return;
  speak(
    `Weather update for ${currentCity}. ${currentWeatherText}. Have a great day!`
  );
}
