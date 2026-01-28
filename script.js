const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");

const weatherBox = document.getElementById("weatherBox");
const hourlyBox = document.getElementById("hourlyBox");
const dailyBox = document.getElementById("dailyBox");
const aqiBox = document.getElementById("aqiBox");
const mapBox = document.getElementById("mapBox");

const placeEl = document.getElementById("place");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const hourlyEl = document.getElementById("hourly");
const dailyEl = document.getElementById("daily");
const aqiValueEl = document.getElementById("aqiValue");
const aqiHealthEl = document.getElementById("aqiHealth");
const mapEl = document.getElementById("map");

let currentLocation = "";
let debounce;

/* AUTOCOMPLETE */
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
  loadAll(loc.lat, loc.lon);
}

function searchCity() {
  if (cityInput.value) fetchSuggestions();
}

/* LOAD EVERYTHING */
async function loadAll(lat, lon) {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  const air = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then(r => r.json());

  renderCurrent(weather.current);
  renderHourly(weather.hourly);
  renderDaily(weather.daily);
  renderAQI(air.list[0].main.aqi);
  loadMap(lat, lon);

  weatherBox.classList.remove("hidden");
  hourlyBox.classList.remove("hidden");
  dailyBox.classList.remove("hidden");
  aqiBox.classList.remove("hidden");
  mapBox.classList.remove("hidden");
}

/* RENDER */
function renderCurrent(c) {
  placeEl.innerText = currentLocation;
  tempEl.innerText = Math.round(c.temp) + "°C";
  descEl.innerText = c.weather[0].description;
  feelsEl.innerText = "Feels " + c.feels_like + "°C";
  humidityEl.innerText = "Humidity " + c.humidity + "%";
  windEl.innerText = "Wind " + c.wind_speed + " km/h";
}

function renderHourly(h) {
  hourlyEl.innerHTML = "";
  h.slice(0,24).forEach(hr=>{
    const d = new Date(hr.dt*1000).getHours();
    hourlyEl.innerHTML += `<div class="hour">${d}:00<br>${Math.round(hr.temp)}°</div>`;
  });
}

function renderDaily(d) {
  dailyEl.innerHTML = "";
  d.slice(1,8).forEach(day=>{
    const name = new Date(day.dt*1000).toLocaleDateString("en",{weekday:"short"});
    dailyEl.innerHTML += `<div class="day">${name}<br>${Math.round(day.temp.max)}°/${Math.round(day.temp.min)}°</div>`;
  });
}

function renderAQI(aqi) {
  const health = [
    "Good 😊",
    "Fair 🙂",
    "Moderate 😐",
    "Poor 😷",
    "Very Poor ☠️"
  ];
  aqiValueEl.innerText = "AQI Level: " + aqi;
  aqiHealthEl.innerText = health[aqi-1];
}

function loadMap(lat,lon){
  mapEl.src = `https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed`;
}

/* LOCATION */
function useMyLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    loadAll(pos.coords.latitude,pos.coords.longitude);
  });
}

/* FAV & REMINDER */
function saveFavourite(){
  localStorage.setItem("fav",currentLocation);
  alert("Saved ⭐");
}

function setReminder(){
  alert("Reminder hook ready (Firebase next)");
}
