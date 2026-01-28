const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

let weatherText = "";

async function searchCity() {
  const q = document.getElementById("cityInput").value.trim();
  if (!q) return;

  fetchWeather(`q=${encodeURIComponent(q)}`);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
  });
}

async function fetchWeather(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
    );
    const d = await res.json();
    if (d.cod !== 200) return;

    document.getElementById("weather").classList.remove("hidden");
    document.getElementById("place").innerText =
      `${d.name}, ${d.sys.country}`;
    document.getElementById("temp").innerText =
      `${Math.round(d.main.temp)}°C`;
    document.getElementById("desc").innerText =
      d.weather[0].description;

    document.getElementById("feels").innerText =
      `Feels ${Math.round(d.main.feels_like)}°C`;
    document.getElementById("humidity").innerText =
      `Humidity ${d.main.humidity}%`;
    document.getElementById("wind").innerText =
      `Wind ${d.wind.speed} km/h`;

    weatherText =
      `In ${d.name}, temperature is ${Math.round(d.main.temp)} degrees with ${d.weather[0].description}.`;

    setTheme(d.weather[0].main.toLowerCase());
  } catch {
    console.warn("Network issue");
  }
}

function setTheme(type) {
  const body = document.body;
  if (type.includes("rain"))
    body.style.background = "linear-gradient(135deg,#667db6,#0082c8)";
  else if (type.includes("cloud"))
    body.style.background = "linear-gradient(135deg,#bdc3c7,#2c3e50)";
  else
    body.style.background = "linear-gradient(135deg,#89f7fe,#66a6ff)";
}

function runAI() {
  alert(weatherText);
}

function runVoice() {
  if (!weatherText) return;
  speak(weatherText);
}
