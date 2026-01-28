const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

// ======================= SEARCH =======================

function searchCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter a location");
  loadWeatherByCity(city);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  });
}

// ======================= WEATHER =======================

async function loadWeatherByCity(city) {
  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo.length) return alert("Location not found");

  loadWeatherByCoords(geo[0].lat, geo[0].lon, geo[0].name, geo[0].country);
}

async function loadWeatherByCoords(lat, lon, name="", country="") {

  const current = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  const forecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  // CURRENT
  document.getElementById("place").innerText =
    `${current.name || name}, ${country || current.sys.country}`;

  document.getElementById("temp").innerText =
    `${Math.round(current.main.temp)}°C`;

  document.getElementById("desc").innerText =
    current.weather[0].description;

  document.getElementById("feels").innerText =
    `Feels: ${Math.round(current.main.feels_like)}°C`;

  document.getElementById("humidity").innerText =
    `Humidity: ${current.main.humidity}%`;

  document.getElementById("wind").innerText =
    `Wind: ${current.wind.speed} km/h`;

  show("weatherBox");

  // HOURLY
  const hourly = document.getElementById("hourly");
  hourly.innerHTML = "";

  forecast.list.slice(0,8).forEach(h => {
    hourly.innerHTML += `
      <div>
        ${h.dt_txt.split(" ")[1
