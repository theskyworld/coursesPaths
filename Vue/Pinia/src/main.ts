import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import {
  addNewPropertyToStore,
  logPluginParams,
  addNewState,
  addNewOptionToStore,
  wrapActions,
} from "./usage/examples/basicUsage/store/plugins";

const pinia = createPinia();
pinia
  .use(addNewPropertyToStore)
  .use(logPluginParams)
  .use(addNewState)
  .use(addNewOptionToStore)
  .use(wrapActions);
// 相较于vuex4中注册的为全局唯一的store对象（从store/index.ts中导入），这里注册的为pinia
createApp(App).use(pinia).mount("#app");
