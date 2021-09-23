<template>
  <div class="message-input-wrapper">
    <div v-if="loading" class="loader"></div>
    <div class="media-list-handler">
      <MessageMedia
        v-if="mediaList.length"
        :media-list="mediaList"
        @delete="removeMedia"
      ></MessageMedia>
      <MessageFiles
        v-if="filesList.length"
        :files-list="filesList"
        @delete="removeFile"
      ></MessageFiles>
    </div>
    <div class="message-block">
      <label class="open-files-btn">
        <input
          type="file"
          name="message-file"
          :accept="acceptFiles"
          multiple
          @input="onDocumentFileInputChange"
        />
        <img src="img/plus.svg" alt="file-icon" />
      </label>
      <label class="open-media-btn">
        <input
          type="file"
          name="message-image"
          :accept="acceptVideoOrImage"
          multiple
          @input="onImageFileInputChange"
        />
        <img src="img/camera.svg" alt="file-icon" />
      </label>
      <div class="input-area">
        <input v-model="message" type="text" @keyup="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script>
import MessageFiles from "@/components/message/MessageFiles";
import MessageMedia from "@/components/message/MessageMedia";
import chat from "@/mixins/chat";
export default {
  name: "MessageInput",
  components: {
    MessageFiles,
    MessageMedia
  },
  mixins: [chat],
  watch: {
    mediaList(val) {
      const length = this.filesList.length + val.length;
      this.$store.commit("setHeight", length);
    },
    filesList(val) {
      const length = this.mediaList.length + val.length;
      this.$store.commit("setHeight", length);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-input";
</style>
