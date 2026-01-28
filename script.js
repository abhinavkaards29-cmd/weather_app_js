const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

function searchWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter city name");
  fetchWeather(`q=${city}`);
}

function useLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
  });
}

function fetchWeather(query) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡 ${data.main.temp}°C</p>
        <p>Feels like: ${data.main.feels_like}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
      `;
    });
}

function setTheme(mode) {
  document.body.className = "";
  if (mode === "light") document.body.classList.add("light");
  if (mode === "system") {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.body.classList.add("light");
    }
  }
}
