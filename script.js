const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weatherBox");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const mapEl = document.getElementById("map");

let currentLocation = "";

async function searchCity() {
  const q = cityInput.value.trim();
  if (!q) return;

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo.length) return alert("Location not found");

  const { lat, lon, name, state, country } = geo[0];
  currentLocation = `${name}${state ? ", " + state : ""}, ${country}`;

  loadWeather(lat, lon);
  loadMap(lat, lon);
}

async function loadWeather(lat, lon) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  placeEl.innerText = currentLocation;
  tempEl.innerText = Math.round(data.main.temp) + "°C";
  descEl.innerText = data.weather[0].description;

  feelsEl.innerText = "Feels " + data.main.feels_like + "°C";
  humidityEl.innerText = "Humidity " + data.main.humidity + "%";
  windEl.innerText = "Wind " + data.wind.speed + " km/h";

  weatherBox.classList.remove("hidden");
}

function loadMap(lat, lon) {
  mapEl.src =
    `https://www.google.com/maps?q=${lat},${lon}&z=13&output=embed`;
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude);
    loadMap(pos.coords.latitude, pos.coords.longitude);
  });
}

function saveFavourite() {
  localStorage.setItem("favourite", currentLocation);
  alert("Saved ⭐");
}

function setReminder() {
  alert("Reminder feature ready for Firebase ⏰");
}
