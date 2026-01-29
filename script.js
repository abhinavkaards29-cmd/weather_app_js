const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

/* ---------- GLOBAL FUNCTIONS (IMPORTANT) ---------- */
window.searchCity = function () {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city name");
  fetchWeatherByCity(city);
};

window.useMyLocation = function () {
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    },
    () => alert("Location permission denied")
  );
};

window.saveFavourite = function () {
  alert("⭐ Favourite saved (demo)");
};

window.setReminder = function () {
  alert("⏰ Reminder set (demo)");
};

/* ---------- WEATHER FETCH ---------- */
function fetchWeatherByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => handleWeather(data));
}

function fetchWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => handleWeather(data));
}

/* ---------- UI UPDATE ---------- */
function handleWeather(data) {
  if (data.cod !== "200") {
    alert("City not found");
    return;
  }

  document.getElementById("weatherBox").classList.remove("hidden");
  document.getElementById("dailyBox").classList.remove("hidden");
  document.getElementById("mapBox").classList.remove("hidden");

  document.getElementById("place").innerText =
    `${data.city.name}, ${data.city.country}`;
  document.getElementById("temp").innerText =
    Math.round(data.list[0].main.temp) + "°C";
  document.getElementById("desc").innerText =
    data.list[0].weather[0].description;

  document.getElementById("feels").innerText =
    "Feels: " + data.list[0].main.feels_like + "°C";
  document.getElementById("humidity").innerText =
    "Humidity: " + data.list[0].main.humidity + "%";
  document.getElementById("wind").innerText =
    "Wind: " + data.list[0].wind.speed + " km/h";

  /* MAP */
  const lat = data.city.coord.lat;
  const lon = data.city.coord.lon;
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;

  /* 7 DAY (SIMPLIFIED) */
  const daily = document.getElementById("daily");
  daily.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const d = data.list[i];
    const day = new Date(d.dt * 1000).toDateString();
    daily.innerHTML += `
      <div class="day">
        <strong>${day}</strong><br>
        ${Math.round(d.main.temp)}°C
      </div>
    `;
  }
}
