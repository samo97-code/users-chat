import Vue from "vue";
import App from "./App.vue";
import "./plugins/axios";
import router from "./router";
import store from "./store";
import cookies from "vue-cookies";
import moment from "vue-moment";
import vueCustomElement from "vue-custom-element";
import "document-register-element/build/document-register-element";

Vue.use(vueCustomElement);
Vue.use(cookies);
Vue.use(moment);

Vue.$cookies.config("2d");
Vue.prototype.$store = store;

App.store = store;
App.router = router;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
