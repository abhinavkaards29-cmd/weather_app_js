const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const weatherBox = document.getElementById("weatherBox");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const mapEl = document.getElementById("map");

let currentLocation = "";
let debounceTimer = null;

/* =====================
   AUTOCOMPLETE SEARCH
===================== */

cityInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  const q = cityInput.value.trim();
  if (q.length < 2) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  debounceTimer = setTimeout(() => fetchSuggestions(q), 350);
});

async function fetchSuggestions(query) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  );

  const data = await res.json();
  if (!data.length) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestionsBox.innerHTML = "";
  suggestionsBox.classList.remove("hidden");

  data.forEach(loc => {
    const item = document.createElement("div");
    item.innerText = `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;
    item.onclick = () => selectLocation(loc);
    suggestionsBox.appendChild(item);
  });
}

function selectLocation(loc) {
  cityInput.value = `${loc.name}${loc.state ? ", " + loc.state : ""}`;
  suggestionsBox.classList.add("hidden");

  currentLocation = `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;
  loadWeather(loc.lat, loc.lon);
  loadMap(loc.lat, loc.lon);
}

/* =====================
   MANUAL SEARCH BUTTON
===================== */

async function searchCity() {
  const q = cityInput.value.trim();
  if (!q) return;

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo.length) return alert("Location not found");

  selectLocation(geo[0]);
}

/* =====================
   WEATHER
===================== */

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

/* =====================
   MAP
===================== */

function loadMap(lat, lon) {
  mapEl.src = `https://www.google.com/maps?q=${lat},${lon}&z=13&output=embed`;
}

/* =====================
   LOCATION BUTTON
===================== */

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude);
    loadMap(pos.coords.latitude, pos.coords.longitude);
  });
}

/* =====================
   FAVOURITE & REMINDER
===================== */

function saveFavourite() {
  localStorage.setItem("favourite", currentLocation);
  alert("Saved ⭐");
}

function setReminder() {
  alert("Reminder ready (Firebase later)");
}
