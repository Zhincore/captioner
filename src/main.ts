import "./styles.css";
import App from "./App.svelte";
import { loadNeu } from "./lib/neu";

loadNeu();

const app = new App({
  target: document.getElementById("app"),
});

export default app;
