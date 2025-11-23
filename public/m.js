(function () {
  try {
    var s = document.createElement("script");
    // Use the minified file
    s.src = "https://cdn.jsdelivr.net/npm/disable-devtool/disable-devtool.min.js";
    // IMPORTANT: this attribute makes it auto-start
    s.setAttribute("disable-devtool-auto", "");
    document.head.appendChild(s);
  } catch (e) {
    // silently ignore
  }

  // Your extra hard-blocks (keep them if you like)
  window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

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

  if (window.top !== window.self) {
    window.location.href = "/chutiya";
  }
})();
