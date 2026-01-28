function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Voice not supported on this device");
    return;
  }

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.95;
  msg.pitch = 1;
  msg.lang = "en-US";
  speechSynthesis.speak(msg);
}
