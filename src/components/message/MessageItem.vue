<template>
  <div
    class="message-wrapper"
    :class="{ 'position-right-wrapper': isRight, 'is-mine': isMine }"
  >
    <div class="message-item" :class="{ 'custom-width': !hasMedia }">
      <div class="message-block">
        <div v-if="!isRight" class="image-side">
          <slot name="avatar"></slot>
        </div>
        <div class="message-side" :class="colors">
          <slot name="username"></slot>
          <div class="content" :class="{ 'has-media': hasMediaSlot }">
            <slot name="message"></slot>
            <slot name="media"></slot>
            <slot name="date"></slot>
            <slot name="status"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageItem",
  props: {
    userType: {
      type: String,
      default: "user",
      validator(value) {
        return ["user", "me"].includes(value);
      }
    },
    order: {
      type: String,
      default: "right"
    },
    massMessage: {
      type: Array,
      required: false,
      default: () => []
    },
    hasMedia: {
      type: [Boolean, Number],
      default: 0
    }
  },
  computed: {
    hasMediaSlot() {
      return this.$slots["media"];
    },
    isRight() {
      return this.userType !== "user" && this.order !== "left";
    },
    isMine() {
      return this.userType === "me";
    },
    colors() {
      return {
        [`message-side__${this.userType}`]: true,
        [`message-side__${this.order}`]: true
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-item";
</style>
