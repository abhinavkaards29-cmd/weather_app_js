const apiKey = "YOUR_API_KEY_HERE"; // 🔑 OpenWeatherMap API key

// AUTO THEME
const themeToggle = document.getElementById("themeToggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    systemDark.matches
      ? document.documentElement.setAttribute("data-theme", "dark")
      : document.documentElement.removeAttribute("data-theme");
  }
}

themeToggle.addEventListener("change", () => {
  localStorage.setItem("theme", themeToggle.value);
  applyTheme(themeToggle.value);
});

applyTheme(localStorage.getItem("theme") || "system");

// WEATHER FUNCTION
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter city name");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("description").innerText =
      data.weather[0].description;
    document.getElementById("temperature").innerText =
      Math.round(data.main.temp);
    document.getElementById("humidity").innerText =
      data.main.humidity;
    document.getElementById("wind").innerText =
      Math.round(data.wind.speed * 3.6);
  } catch {
    alert("City not found");
  }
}
