import { init } from "@neutralinojs/lib";

/** My over-complicated load function, because I couldn't get it to work in production otherwise. */
export function loadNeu() {
  // Parse the script
  const parseEl = document.createElement("html");
  parseEl.innerHTML = document.body.getAttribute("data-neu-script");
  const neuScript = parseEl.getElementsByTagName("script")[0];

  // Parse the url
  const url = new URL(neuScript.getAttribute("src"));
  if (import.meta.env.PROD) {
    url.host = window.location.host;
  }

  // Create new script
  const script = document.createElement("script");
  script.setAttribute("src", url.href);

  // Attach callback
  script.onload = () => init();

  // Start
  document.body.appendChild(script);
}
