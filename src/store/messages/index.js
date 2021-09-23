const namespaced = true;
import Vue from "vue";
const actions = {
  /**
   * @param context {Object<{chat_id: String, show_from: String, limit: Number}>}
   * @param payload
   * @returns {Promise<AxiosResponse<any>>}
   */
  async list(context, payload) {
    let query = `limit=${payload.limit ? payload.limit : 15}`;
    if (payload.show_from) {
      query += `&show_from=${payload.show_from}`;
    }
    return await Vue.axios.get(`/chats/${payload.chat_id}/messages?${query}`);
  }
};
export default {
  namespaced,
  actions
};
