const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(showWeather)
    .catch(() => alert("City not found"));
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(showWeather);
  });
}

function showWeather(data) {
  document.getElementById("result").innerHTML = `
    <strong>${data.name}</strong><br>
    🌡 ${data.main.temp}°C<br>
    ${data.weather[0].description}
  `;
}

function setTheme(mode) {
  if (mode === "auto") {
    document.body.className =
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "";
  } else {
    document.body.className = mode;
  }
}
