import "./styles.css";
import { init } from "@neutralinojs/lib";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

init();

export default app;
