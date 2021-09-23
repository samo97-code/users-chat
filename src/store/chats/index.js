const namespaced = true;
import Vue from "vue";
import { functions } from "@/utils";

const actions = {
  /**
   * @param context
   * @param payload
   * @returns {Promise<AxiosResponse<any>>}
   */
  async list(context, payload) {
    return await Vue.axios.get("/chats/list?limit=1000", payload);
  },
  /**
   * @param context
   * @param payload {Object<{opponent_id:Number}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async createSingle(context, payload) {
    return await Vue.axios.post("/chats/create_single", payload);
  },
  /**
   * @param context
   * @param payload {Object<{members:Array, name: String, img_url: String}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async createGroup(context, payload) {
    const formData = functions.formData(payload);
    const headers = functions.filesHeaders();
    return await Vue.axios.post("/chats/create_group", formData, {
      headers
    });
  },
  /**
   * @param context
   * @param payload {Object<{chat_id: String}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async chatLeave(context, payload) {
    return await Vue.axios.post(`/chats/leave`, payload);
  },
  /**
   * @param context
   * @param payload {Object<{chat_id: String, user_id: Number}>}
   * @returns {Promise<void>}
   */
  async removeUser(context, payload) {
    return await Vue.axios.post("/chats/remove_user", payload);
  },
  /**
   * @param context
   * @param payload {Object<{chat_id: String, user_ids: Array}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async addUsers(context, payload) {
    return await Vue.axios.post("/chats/add_users", payload);
  },
  /**
   * @param context
   * @param payload {Object<{chat_id: String, photo: File, name: String}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async update(context, payload) {
    const formData = functions.formData(payload.data, payload.file);
    const headers = functions.filesHeaders();
    return await Vue.axios.patch("/chats/update", formData, { headers });
  },
  /**
   * @param context
   * @param payload {Object<{chat_id: String}>}
   * @returns {Promise<void>}
   */
  async chatMembers(context, payload) {
    return await Vue.axios.get(`/chats/${payload.chat_id}/members`);
  },

  /**
   * @param context
   * @param payload {Object<{chat_id: String, user_ids: Array<Number>}>}
   * @returns {Promise<AxiosResponse<any>>}
   */
  async editUsers(context, payload) {
    return await this.axios.post("/chats/edit_users", payload);
  }
};

export default {
  namespaced,
  actions
};
