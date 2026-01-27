// 🔑 Replace ONLY this value
const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

// 🌗 THEME HANDLING
const themeSelect = document.getElementById("themeSelect");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.className = "dark";
  } else if (theme === "light") {
    document.documentElement.className = "light";
  } else {
    document.documentElement.className = "";
  }
}

themeSelect.addEventListener("change", () => {
  localStorage.setItem("theme", themeSelect.value);
  applyTheme(themeSelect.value);
});

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "system";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// 🌦️ WEATHER FETCH
function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultBox = document.getElementById("weatherResult");

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert("City not found");
        return;
      }

      document.getElementById("cityName").innerText = data.name;
      document.getElementById("temperature").innerText =
        `🌡️ ${Math.round(data.main.temp)}°C`;
      document.getElementById("condition").innerText =
        `☁️ ${data.weather[0].description}`;

      resultBox.classList.remove("hidden");
      resultBox.classList.add("slide-up");
    })
    .catch(() => {
      alert("Something went wrong");
    });
}
