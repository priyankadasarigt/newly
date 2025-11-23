(function () {
  try {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/disable-devtool";
    s.setAttribute("data-defer", "false"); // IMPORTANT FIX
    document.head.appendChild(s);
  } catch (e) {}

  // Block right-click
  window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Block keys
  window.addEventListener("keydown", function (e) {
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    ) {
      e.preventDefault();
      window.location.href = "/chutiya";
    }
  });

  // Block iframe embedding
  if (window.top !== window.self) {
    window.location.href = "/chutiya";
  }
})();
