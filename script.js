const API_KEY = "21c37b3cf3fc437adbbab13394d14186";
let map, marker;

function setTheme(mode) {
  if (mode === "auto") {
    document.body.className = window.matchMedia("(prefers-color-scheme: dark)").matches ? "" : "light";
  } else {
    document.body.className = mode === "light" ? "light" : "";
  }
}

async function searchWeather() {
  const q = document.getElementById("searchInput").value;
  if (!q) return alert("Enter location");

  const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`).then(r=>r.json());
  if (!geo[0]) return alert("Location not found");

  loadWeather(geo[0].lat, geo[0].lon, geo[0]);
}

function useLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude);
  });
}

async function loadWeather(lat, lon, place={}) {
  const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(r=>r.json());
  const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(r=>r.json());

  document.getElementById("weatherBox").innerHTML = `
    <h2>${place.name || data.name}</h2>
    <h1>${Math.round(data.main.temp)}°C</h1>
    <p>Feels like ${Math.round(data.main.feels_like)}°C</p>
    <p>${data.weather[0].description}</p>
    <p>💧 ${data.main.humidity}% | 💨 ${data.wind.speed} m/s</p>
    <button onclick="saveFavorite('${place.name || data.name}')">⭐ Save</button>
  `;

  renderForecast(forecast.list);
  renderMap(lat, lon);
}

function renderForecast(list) {
  const el = document.getElementById("forecast");
  el.innerHTML = "";
  list.filter((_,i)=>i%8===0).forEach(d=>{
    el.innerHTML += `
      <div class="forecast-item">
        <p>${new Date(d.dt_txt).toDateString().slice(0,3)}</p>
        <p>${Math.round(d.main.temp)}°</p>
      </div>
    `;
  });
}

function renderMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]);
  }
}

function saveFavorite(city) {
  const fav = JSON.parse(localStorage.getItem("fav")) || [];
  if (!fav.includes(city)) fav.push(city);
  localStorage.setItem("fav", JSON.stringify(fav));
  loadFavorites();
}

function loadFavorites() {
  const el = document.getElementById("favorites");
  el.innerHTML = "";
  (JSON.parse(localStorage.getItem("fav"))||[]).forEach(c=>{
    el.innerHTML += `<li onclick="document.getElementById('searchInput').value='${c}';searchWeather()">${c}</li>`;
  });
}

loadFavorites();
setTheme("auto");
