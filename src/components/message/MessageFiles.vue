<template>
  <div class="message-files-list-wrapper">
    <ul class="files-list">
      <li v-for="(file, index) in filesList" :key="index + 'image'">
        <span class="filename">{{ file.name }}</span>
        <span class="remove-icon" @click="onRemoveFile(index)"></span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "MessageFiles",
  props: {
    filesList: {
      type: Array,
      required: true
    }
  },
  methods: {
    onRemoveFile(index) {
      this.$emit("delete", index);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/assets/scss/message/message-files";
</style>
