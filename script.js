const WEATHER_KEY = "21c37b3cf3fc437adbbab13394d14186";

let currentCity = "";
let currentWeatherText = "";

async function searchCity() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter city");
  fetchWeather(`q=${city}`);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(
    p => fetchWeather(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
    () => alert("Location denied")
  );
}

async function fetchWeather(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${WEATHER_KEY}`
    );

    const d = await res.json();
    if (d.cod !== 200) throw new Error("City not found");

    currentCity = `${d.name}, ${d.sys.country}`;
    currentWeatherText = `
      Temperature ${d.main.temp}°C,
      Feels like ${d.main.feels_like}°C,
      Humidity ${d.main.humidity}%,
      Wind ${d.wind.speed} km/h,
      ${d.weather[0].description}
    `;

    weatherResult.classList.remove("hidden");
    cityName.innerText = currentCity;
    temp.innerText = Math.round(d.main.temp) + "°C";
    condition.innerText = d.weather[0].description;
    feels.innerText = "Feels " + d.main.feels_like + "°C";
    humidity.innerText = "Humidity " + d.main.humidity + "%";
    wind.innerText = "Wind " + d.wind.speed + " km/h";

  } catch (e) {
    alert("Network error");
  }
}

function runAI() {
  if (!currentWeatherText) return alert("Search weather first");
  alert("AI Insight:\n" + currentWeatherText);
}

function runVoice() {
  if (typeof speak === "function") {
    speak(`Weather in ${currentCity}. ${currentWeatherText}`);
  }
}

function saveFavorite() {
  localStorage.setItem("fav", currentCity);
  alert("Saved ⭐");
}

function enableAlerts() {
  Notification.requestPermission();
}

function setTheme(t) {
  document.body.className = t;
}

/* EXPOSE GLOBALS (CRITICAL) */
window.searchCity = searchCity;
window.useMyLocation = useMyLocation;
window.runAI = runAI;
window.runVoice = runVoice;
window.saveFavorite = saveFavorite;
window.enableAlerts = enableAlerts;
window.setTheme = setTheme;
