const namespaced = true;
import Vue from "vue";

const actions = {
  /**
   * @param context {Object<{email:String, password:String}>}
   * @param payload
   * @returns {Promise<AxiosResponse<{"access_token": String, "refresh_token": String, "token_type": String}>>}
   */
  async login(context, payload) {
    return await Vue.axios.post("/auth/login", payload);
  },
  /**
   * @param context {Object<{refresh_token: String}>}
   * @param payload
   * @returns {Promise<AxiosResponse<any>>}
   */
  async loginWithExternal(context, payload) {
    return await this.axios.post("/auth/external_login", payload);
  },

  /**
   * @param context
   * @param payload
   * @returns {Promise<AxiosResponse<any>>}
   */
  async profile(context, payload) {
    return await Vue.axios.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    });
  },
  /**
   * @param context
   * @param payload {Object<{search: String, show_from: Number, limit: Number}>}
   * @returns {Promise<void>}
   */
  async filter(context, payload) {
    let query = new URLSearchParams(payload).toString();
    return await this.axios.get(`/users/filter?${query}`);
  },
  /**
   * @param context
   * @param payload {Object<{show_from: Number, limit: Number}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async friends(context, payload) {
    let query = new URLSearchParams(payload).toString();
    return await Vue.axios.get(`/users/friends?${query}`);
  },
  async externalProfile(context, payload) {
    return await this.axios.get(`/users/external`);
  }
};

export default {
  namespaced,
  actions
};
