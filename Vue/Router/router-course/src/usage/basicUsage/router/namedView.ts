import { createRouter, createWebHashHistory } from "vue-router";
import FirstView from "../components/FirstView.vue";
import SecondView from "../components/SecondView.vue";
import ThirdView from "../components/ThirdView.vue";

const routes = [
  {
    path: "/",
    // 命名视图
    components: {
      first: FirstView,
      second: SecondView,
      third: ThirdView,
    },
  },
  {
    path: "/another",
    components: {
      first: ThirdView,
      second: SecondView,
      third: FirstView,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
