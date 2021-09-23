import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  },
  {
    path: "/",
    name: "Messages",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Messages.vue")
  },
  {
    path: "/messages/:id",
    name: "UserMessage",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserMessage")
  }
];

const router = new VueRouter({
  routes
});

export default router;
