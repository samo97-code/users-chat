<template>
  <div v-if="mediaList.length" class="message-media-list-wrapper">
    <ul class="images-list">
      <li v-for="(item, index) in mediaList" :key="index + 'image'">
        <span class="media-wrapper">
          <img
            v-if="!item.isVideo"
            :src="item.url ? item.url : loader"
            :alt="index + 'Uploaded image'"
          />
          <video v-if="item.isVideo">
            <source :src="item.url ? item.url : loader" type="video/mp4" />
          </video>
        </span>
        <span class="filename">{{ item.file.name }}</span>
        <span class="remove-icon" @click="onRemoveFile(index)"></span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "MessageFiles",
  props: {
    mediaList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loader: "img/loader.svg"
    };
  },
  methods: {
    onRemoveFile(index) {
      this.$emit("delete", index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-media";
</style>
