import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./usage/basicUsage/router/routeGuard";

createApp(App).use(router).mount("#app");
