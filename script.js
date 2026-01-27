// 🔑 PUT YOUR API KEY HERE
const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

// 🌗 THEME SYSTEM
const themeSelect = document.getElementById("themeSelect");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

themeSelect.addEventListener("change", () => {
  localStorage.setItem("theme", themeSelect.value);

  if (themeSelect.value === "system") {
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } else {
    applyTheme(themeSelect.value);
  }
});

// Load theme
const savedTheme = localStorage.getItem("theme") || "system";
themeSelect.value = savedTheme;
if (savedTheme === "system") {
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} else {
  applyTheme(savedTheme);
}

// 🔍 CITY SEARCH
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter city name");

  document.getElementById("loader").classList.remove("hidden");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error();

    const data = await res.json();
    showWeather(data);
  } catch {
    alert("City not found");
  } finally {
    document.getElementById("loader").classList.add("hidden");
  }
}

// 📍 GPS WEATHER
function getLocationWeather() {
  if (!navigator.geolocation) return alert("GPS not supported");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    document.getElementById("loader").classList.remove("hidden");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      showWeather(data);
    } catch {
      alert("Location error");
    } finally {
      document.getElementById("loader").classList.add("hidden");
    }
  });
}

// 📊 DISPLAY
function showWeather(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText = `🌡️ ${Math.round(data.main.temp)}°C`;
  document.getElementById("condition").innerText = `☁️ ${data.weather[0].description}`;
  document.getElementById("weatherResult").classList.remove("hidden");
}

// ⌨ ENTER KEY
document.getElementById("cityInput").addEventListener("keydown", e => {
  if (e.key === "Enter") getWeather();
});

// 📱 PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
