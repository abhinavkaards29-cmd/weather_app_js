function setWeatherBackground(type) {
  document.body.classList.remove("clear", "clouds", "rain");

  if (type.includes("rain")) {
    document.body.classList.add("rain");
  } else if (type.includes("cloud")) {
    document.body.classList.add("clouds");
  } else {
    document.body.classList.add("clear");
  }
}
