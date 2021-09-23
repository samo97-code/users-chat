<template>
  <div
    class="user-item-wrapper"
    :class="{ 'is-active': isActive }"
    @click="openChat"
  >
    <div class="left-side">
      <div class="user-avatar">
        <slot name="avatar"></slot>
        <span :class="{ 'is-online': isOnline }"></span>
      </div>
      <div class="user-info">
        <slot name="full-name"></slot>
        <slot name="description"></slot>
      </div>
    </div>
    <div class="right-side">
      <slot name="date"></slot>
      <slot name="read"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserMessageItem",
  props: {
    isOnline: {
      type: Boolean,
      required: false,
      default: false
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    openChat() {
      this.$emit("on-click");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/user-message-item";
</style>
