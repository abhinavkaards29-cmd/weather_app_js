const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

let currentCity = "";

/* SEARCH CITY */
function searchCity() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter city name");
  fetchWeather(`q=${city}`);
}

/* USE LOCATION */
function useMyLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),
    () => alert("Location permission denied")
  );
}

/* FETCH WEATHER */
async function fetchWeather(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    renderWeather(data);
  } catch (e) {
    alert("Network error");
  }
}

/* RENDER */
function renderWeather(data) {
  currentCity = data.name;

  weatherBox.classList.remove("hidden");
  mapCard.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent = data.weather[0].description;

  feels.textContent = `Feels ${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `Humidity ${data.main.humidity}%`;
  wind.textContent = `Wind ${data.wind.speed} km/h`;

  mapFrame.src =
    `https://www.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=10&output=embed`;
}

/* FAVOURITE */
function saveFavorite() {
  if (!currentCity) return;
  localStorage.setItem("favCity", currentCity);
  alert("Saved ⭐");
}

/* LOAD FAV */
window.addEventListener("load", () => {
  const fav = localStorage.getItem("favCity");
  if (fav) {
    cityInput.value = fav;
    searchCity();
  }
});

/* REMINDER */
function setReminder() {
  if (!currentCity) return;

  Notification.requestPermission().then(p => {
    if (p !== "granted") return;

    setTimeout(() => {
      new Notification("Weather Reminder 🌦️", {
        body: `Check weather for ${currentCity}`
      });
    }, 10 * 60 * 1000);
  });
}
