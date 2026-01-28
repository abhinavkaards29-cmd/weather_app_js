const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");

const weatherBox = document.getElementById("weatherBox");
const hourlyBox = document.getElementById("hourlyBox");
const dailyBox = document.getElementById("dailyBox");
const mapBox = document.getElementById("mapBox");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const hourlyEl = document.getElementById("hourly");
const dailyEl = document.getElementById("daily");
const mapEl = document.getElementById("map");

let currentLocation = "";
let debounce;

/* =====================
   AUTOCOMPLETE
===================== */
cityInput.addEventListener("input", () => {
  clearTimeout(debounce);
  if (cityInput.value.length < 2) {
    suggestions.classList.add("hidden");
    return;
  }
  debounce = setTimeout(fetchSuggestions, 300);
});

async function fetchSuggestions() {
  const q = cityInput.value;
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`
  );
  const data = await res.json();

  suggestions.innerHTML = "";
  suggestions.classList.remove("hidden");

  data.forEach(loc => {
    const div = document.createElement("div");
    div.innerText = `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;
    div.onclick = () => selectLocation(loc);
    suggestions.appendChild(div);
  });
}

function selectLocation(loc) {
  suggestions.classList.add("hidden");
  cityInput.value = loc.name;
  currentLocation = `${loc.name}${loc.state ? ", " + loc.state : ""}, ${loc.country}`;
  loadWeather(loc.lat, loc.lon);
  loadForecast(loc.lat, loc.lon);
  loadMap(loc.lat, loc.lon);
}

function searchCity() {
  if (cityInput.value) fetchSuggestions();
}

/* =====================
   CURRENT WEATHER
===================== */
async function loadWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  placeEl.innerText = currentLocation;
  tempEl.innerText = Math.round(data.main.temp) + "°C";
  descEl.innerText = data.weather[0].description;
  feelsEl.innerText = "Feels " + data.main.feels_like + "°C";
  humidityEl.innerText = "Humidity " + data.main.humidity + "%";
  windEl.innerText = "Wind " + data.wind.speed + " km/h";

  weatherBox.classList.remove("hidden");
}

/* =====================
   FORECAST (7-DAY STYLE)
===================== */
async function loadForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  hourlyEl.innerHTML = "";
  dailyEl.innerHTML = "";

  /* Hourly (next 24h) */
  data.list.slice(0, 8).forEach(item => {
    const time = new Date(item.dt * 1000).getHours();
    hourlyEl.innerHTML += `
      <div class="hour">
        ${time}:00<br>${Math.round(item.main.temp)}°
      </div>`;
  });

  /* 7-day summary (one per day) */
  const days = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!days[date]) days[date] = item;
  });

  Object.values(days).slice(0, 7).forEach(d => {
    const day = new Date(d.dt * 1000)
      .toLocaleDateString("en", { weekday: "short" });
    dailyEl.innerHTML += `
      <div class="day">
        ${day}<br>
        ${Math.round(d.main.temp_max)}° /
        ${Math.round(d.main.temp_min)}°
      </div>`;
  });

  hourlyBox.classList.remove("hidden");
  dailyBox.classList.remove("hidden");
}

/* =====================
   MAP
===================== */
function loadMap(lat, lon) {
  mapEl.src = `https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed`;
  mapBox.classList.remove("hidden");
}
   function updateMap(lat, lon) {
  const mapFrame = document.getElementById("mapFrame");
  if (!mapFrame) return;

  mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed`;
}
}

/* =====================
   LOCATION
===================== */
function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude);
    loadForecast(pos.coords.latitude, pos.coords.longitude);
    loadMap(pos.coords.latitude, pos.coords.longitude);
  });
}

/* =====================
   FAV & REMINDER
===================== */
function saveFavourite() {
  localStorage.setItem("fav", currentLocation);
  alert("Saved ⭐");
}

function setReminder() {
  alert("Reminder ready (Firebase later)");
}
async function fetchWeatherByCoords(lat, lon, name, state, country) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`
    );

    const data = await res.json();
    if (data.cod !== 200) {
      alert("Weather data not available");
      return;
    }

    // Location text (city + state + country)
    const locationText = `${name}${state ? ", " + state : ""}, ${country}`;

    currentCity = locationText;
    currentWeatherText = `
Temperature ${data.main.temp}°C,
Feels like ${data.main.feels_like}°C,
Humidity ${data.main.humidity}%,
Wind ${data.wind.speed} km/h,
Condition ${data.weather[0].description}
`;

    // UI update (same as before)
    document.getElementById("weatherResult").classList.remove("hidden");
    document.getElementById("cityName").innerText = locationText;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").innerText = data.weather[0].description;
    document.getElementById("feels").innerText = `Feels ${data.main.feels_like}°C`;
    document.getElementById("humidity").innerText = `Humidity ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind ${data.wind.speed} km/h`;

    // Map update (iframe)
    updateMap(lat, lon);

    setWeatherBackground(data.weather[0].main.toLowerCase());

  } catch (err) {
    alert("Network error");
    console.error(err);
  }
}
