const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

// 🔍 SEARCH
window.searchWeather = function () {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Enter a city name");
    return;
  }

  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
};

// 📍 GPS
window.useMyLocation = function () {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
    },
    () => alert("Location permission denied")
  );
};

// 🌗 THEME
window.setTheme = function (mode) {
  if (mode === "auto") {
    document.body.className =
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "";
  } else {
    document.body.className = mode;
  }
};

// 🌦 FETCH + DISPLAY
function fetchWeather(url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(data => {
      document.getElementById("result").innerHTML = `
        <strong>${data.name}</strong><br>
        🌡 ${Math.round(data.main.temp)}°C<br>
        ${data.weather[0].description}
      `;
    })
    .catch(() => alert("Weather not found"));
}
