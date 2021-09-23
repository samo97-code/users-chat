import axios from "axios";
import cookies from "vue-cookies";
import VueAxios from "vue-axios";
import Vue from "vue";

const token = cookies.get("token")
  ? cookies.get("token")
  : localStorage.getItem("token");
let headers = {};
if (token) {
  headers = {
    Authorization: `Bearer ${token}`
  };
}

const api = axios.create({
  baseURL: process.env.VUE_APP_API,
  headers
});

Vue.use(VueAxios, api);
