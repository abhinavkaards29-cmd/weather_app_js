// ================= CONFIG =================
const WEATHER_KEY = "21c37b3cf3fc437adbbab13394d14186";

// ================= STATE =================
let currentCity = "";
let currentWeatherText = "";

// ================= WEATHER =================
function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Enter a city name");
    return;
  }
  fetchWeather(`q=${city}`);
}

function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
    },
    () => alert("Location permission denied")
  );
}

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

    currentCity = data.name;
    currentWeatherText = `
Temperature ${data.main.temp}°C.
Feels like ${data.main.feels_like}°C.
Humidity ${data.main.humidity}%.
Wind ${data.wind.speed} km per hour.
Condition ${data.weather[0].description}.
`;

    document.getElementById("weatherResult").classList.remove("hidden");
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("condition").innerText = data.weather[0].description;
    document.getElementById("feels").innerText = "Feels like " + data.main.feels_like + "°C";
    document.getElementById("humidity").innerText = "Humidity " + data.main.humidity + "%";
    document.getElementById("wind").innerText = "Wind " + data.wind.speed + " km/h";

    setWeatherBackground(data.weather[0].main.toLowerCase());

  } catch (err) {
    alert("Network error");
    console.error(err);
  }
}

// ================= UI =================
function setTheme(theme) {
  document.body.className = theme;
}

// ================= EXTRAS =================
function saveFavorite() {
  if (!currentCity) return;
  localStorage.setItem("favoriteCity", currentCity);
  alert("Favorite saved ⭐");
}

function enableAlerts() {
  Notification.requestPermission().then(p => {
    if (p === "granted") {
      new Notification("Weather alerts enabled 🌦️");
    }
  });
}

function runAI() {
  if (!currentWeatherText) return;
  if (typeof speak === "function") {
    speak(`Weather update for ${currentCity}. ${currentWeatherText}`);
  } else {
    alert("AI voice not loaded");
  }
}

// ================= EXPOSE TO HTML =================
window.searchCity = searchCity;
window.useMyLocation = useMyLocation;
window.runAI = runAI;
window.saveFavorite = saveFavorite;
window.enableAlerts = enableAlerts;
window.setTheme = setTheme;
