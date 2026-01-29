const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

/* BUTTONS */
function searchCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter a place name");
  fetchByName(city);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetchAll(pos.coords.latitude, pos.coords.longitude);
  });
}

/* SEARCH → LAT/LON */
async function fetchByName(name) {
  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo.length) return alert("Place not found");
  fetchAll(geo[0].lat, geo[0].lon, geo[0].name, geo[0].country);
}

/* WEATHER + FORECAST */
async function fetchAll(lat, lon, name="", country="") {

  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  const forecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  // CURRENT
  document.getElementById("place").innerText =
    `${weather.name || name}, ${country || weather.sys.country}`;

  document.getElementById("temp").innerText =
    Math.round(weather.main.temp) + "°C";

  document.getElementById("desc").innerText =
    weather.weather[0].description;

  document.getElementById("details").innerText =
    `Feels ${weather.main.feels_like}°C • Humidity ${weather.main.humidity}% • Wind ${weather.wind.speed} km/h`;

  show("current");

  // 7 DAY
  const daysEl = document.getElementById("days");
  daysEl.innerHTML = "";

  const daily = {};
  forecast.list.forEach(item => {
    const d = item.dt_txt.split(" ")[0];
    if (!daily[d]) daily[d] = item;
  });

  Object.values(daily).slice(0,7).forEach(d => {
    daysEl.innerHTML += `
      <div>
        ${new Date(d.dt_txt).toLocaleDateString("en",{weekday:"short"})}
        : ${Math.round(d.main.temp)}°C
      </div>`;
  });

  show("forecast");

  // MAP
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed`;

  show("mapBox");
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

/* GLOBAL SAFETY */
window.searchCity = searchCity;
window.useMyLocation = useMyLocation;
