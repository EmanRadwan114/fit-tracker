import { createApp } from "vue";
import { createPinia } from "pinia";
import "./main.css";

import App from "./App.vue";
import router from "./router";
import Button from "./components/ui/Button.vue";
import FormInput from "./components/ui/FormInput.vue";
import Container from "./components/ui/Container.vue";

const app = createApp(App);

// global components
app.component("Button", Button);
app.component("FormInput", FormInput);
app.component("Container", Container);

// packages
app.use(createPinia());
app.use(router);

app.mount("#app");
