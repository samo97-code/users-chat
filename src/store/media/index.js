const namespaced = true;
import Vue from "vue";
import { functions } from "@/utils";
const actions = {
  /**
   * @param context {Object<{upload_session_id: String|null, chunk_index: Number, chunks_count: Number, chunk: File, file_ext: String}>}
   * @param payload
   * @returns {Promise<AxiosResponse<any>>}
   */
  async upload(context, payload) {
    let uploaded = false;
    const chunkUploadSize = 1024 * 1024 * 1024 * 1024;
    let current = 0;
    const uploadCallback = payload.uploadCallback;
    const file = payload.file;
    const chunks = Math.ceil(file.size / chunkUploadSize);
    let uploadSession = null;

    while (!uploaded) {
      const offset = chunkUploadSize * current;
      const chunk = file.slice(offset, offset + chunkUploadSize);
      const fileForUpload = await functions.prepareChunk(chunk, file);
      const formData = new FormData();
      formData.append("file_ext", fileForUpload.name.split(".").pop());
      formData.append("chunks_count", chunks);
      formData.append("chunk", fileForUpload);
      formData.append("chunk_index", current);
      formData.append("file_name", fileForUpload.name);
      if (uploadSession !== null) {
        formData.append("upload_session", uploadSession);
      }
      uploaded = true;

      const headers = functions.filesHeaders();
      const uploadCallbackFunction = uploadCallback || (() => {});
      const resp = await Vue.axios.post("/media/upload", formData, {
        headers,
        onUploadProgress: uploadCallbackFunction.bind(
          this,
          current,
          chunks,
          fileForUpload
        )
      });
      uploadSession = resp.data;
      uploaded = resp.data.is_finished;
      current += 1;
      if (uploaded) {
        return uploadSession;
      }
    }
  }
};
export default {
  namespaced,
  actions
};
