/* =========================
   CONFIG
========================= */
const WEATHER_KEY = "21c37b3cf3fc437adbbab13394d14186";

/* =========================
   STATE
========================= */
let currentCity = "";
let currentWeatherText = "";

/* =========================
   SEARCH BY CITY
========================= */
async function searchCity() {
  const input = document.getElementById("cityInput");
  if (!input) return;

  const city = input.value.trim();
  if (!city) {
    alert("Enter a city name");
    return;
  }

  fetchWeather(`q=${city}`);
}

/* =========================
   USE MY LOCATION
========================= */
function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`lat=${latitude}&lon=${longitude}`);
    },
    () => alert("Location permission denied")
  );
}

/* =========================
   FETCH WEATHER
========================= */
async function fetchWeather(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${WEATHER_KEY}`
    );

    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found");
      return;
    }

    renderWeather(data);
  } catch (err) {
    alert("Weather fetch failed");
    console.error(err);
  }
}

/* =========================
   RENDER WEATHER
========================= */
function renderWeather(data) {
  currentCity = data.name;

  currentWeatherText = `
Temperature ${Math.round(data.main.temp)}°C.
Feels like ${Math.round(data.main.feels_like)}°C.
Humidity ${data.main.humidity} percent.
Wind speed ${data.wind.speed} kilometers per hour.
Condition ${data.weather[0].description}.
`;

  document.getElementById("weatherResult")?.classList.remove("hidden");
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
  document.getElementById("condition").innerText = data.weather[0].description;
  document.getElementById("feels").innerText = `Feels ${Math.round(
    data.main.feels_like
  )}°C`;
  document.getElementById("humidity").innerText = `Humidity ${data.main.humidity}%`;
  document.getElementById("wind").innerText = `Wind ${data.wind.speed} km/h`;

  // 🔥 Connect background animation safely
  if (typeof setWeatherBackground === "function") {
    setWeatherBackground(data.weather[0].main.toLowerCase());
  }
}

/* =========================
   FAVORITES (LOCAL)
========================= */
function saveFavorite() {
  if (!currentCity) {
    alert("Search a city first");
    return;
  }

  localStorage.setItem("favoriteCity", currentCity);
  alert("Favorite saved ⭐");
}

/* =========================
   ALERTS
========================= */
function enableAlerts() {
  if (!("Notification" in window)) {
    alert("Notifications not supported");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("Weather alerts enabled 🌦️");
    }
  });
}

/* =========================
   AI WEATHER VOICE
========================= */
function runAI() {
  if (!currentWeatherText) {
    alert("Search weather first");
    return;
  }

  if (typeof speak === "function") {
    speak(`Weather update for ${currentCity}. ${currentWeatherText}`);
  }
}

/* =========================
   EXPOSE TO HTML (CRITICAL)
========================= */
window.searchCity = searchCity;
window.useMyLocation = useMyLocation;
window.saveFavorite = saveFavorite;
window.enableAlerts = enableAlerts;
window.runAI = runAI;

/* Needed for theme buttons */
window.setTheme = window.setTheme || function () {};
