import Vue from "vue";
import Vuex from "vuex";
import users from "@/store/users/index";
import media from "@/store/media/index";
import chats from "@/store/chats/index";
import messages from "@/store/messages/index";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    correctHeight: false
  },
  mutations: {
    setHeight(state, payload) {
      state.correctHeight = payload;
    }
  },
  actions: {},
  modules: {
    users,
    chats,
    media,
    messages
  }
});
