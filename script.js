const API_KEY = "21c37b3cf3fc437adbbab13394d14186";
let map, marker;

// THEME
function setTheme(mode) {
  if (mode === "auto") {
    document.body.className =
      matchMedia("(prefers-color-scheme: light)").matches ? "light" : "";
  } else {
    document.body.className = mode === "light" ? "light" : "";
  }
}

// SEARCH
async function searchWeather() {
  const q = searchInput.value;
  if (!q) return alert("Enter location");

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo[0]) return alert("Location not found");
  loadWeather(geo[0].lat, geo[0].lon, geo[0].name);
}

// GPS
function useLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude);
  });
}

// LOAD WEATHER
async function loadWeather(lat, lon, name="") {
  const current = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r=>r.json());

  const forecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r=>r.json());

  const onecall = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then(r=>r.json());

  renderCurrent(current,name);
  renderForecast(forecast.list);
  renderMap(lat,lon);
  renderAlerts(onecall.alerts);
}

// UI
function renderCurrent(d,name){
  current.innerHTML=`
    <h2>${name||d.name}, ${d.sys.country}</h2>
    <h1>${Math.round(d.main.temp)}°C</h1>
    <p>Feels ${Math.round(d.main.feels_like)}°C</p>
    <p>💧 ${d.main.humidity}% | 💨 ${d.wind.speed} m/s</p>
    <button onclick="saveFav('${d.name}')">⭐ Save</button>
  `;
}

function renderForecast(list){
  forecast.innerHTML="";
  list.filter((_,i)=>i%8===0).forEach(d=>{
    forecast.innerHTML+=`
      <div class="forecast-card">
        <p>${new Date(d.dt_txt).toDateString().slice(0,3)}</p>
        <p>${Math.round(d.main.temp)}°</p>
      </div>
    `;
  });
}

function renderMap(lat,lon){
  if(!map){
    map=L.map("map").setView([lat,lon],10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    marker=L.marker([lat,lon]).addTo(map);
  }else{
    map.setView([lat,lon],10);
    marker.setLatLng([lat,lon]);
  }
}

function renderAlerts(alerts){
  if(!alerts||alerts.length===0){
    alerts.innerHTML="";
    return;
  }
  alerts.innerHTML=`⚠️ ${alerts[0].event}: ${alerts[0].description}`;
}

// FAVORITES
function saveFav(city){
  const fav=JSON.parse(localStorage.getItem("fav"))||[];
  if(!fav.includes(city)) fav.push(city);
  localStorage.setItem("fav",JSON.stringify(fav));
  loadFav();
}

function loadFav(){
  favorites.innerHTML="";
  (JSON.parse(localStorage.getItem("fav"))||[]).forEach(c=>{
    favorites.innerHTML+=`<li onclick="searchInput.value='${c}';searchWeather()">${c}</li>`;
  });
}

loadFav();
setTheme("auto");
