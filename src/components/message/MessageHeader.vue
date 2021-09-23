<template>
  <div class="header-wrapper">
    <div v-if="showSearch" class="header">
      <div class="label">Komu:</div>
      <UserList :tab="tab" />
    </div>

    <div v-if="!showSearch && $route.name === 'UserMessage'" class="user-info">
      <div class="left-side">
        <button class="back-btn" @click="$router.go(-1)">
          <img src="img/back-btn.svg" alt="back" />
        </button>
        <span class="user-avatar">
          <img :src="currentChat.img_url" alt="avatar" />
        </span>
        <span class="username">{{ currentChat.name }}</span>
      </div>
      <div v-if="tab === 'Konverzace'" class="right-side">
        <button class="settings-btn" @click="openModal">
          <img src="img/settings.svg" alt="settings" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from "@/components/search-users/UserList";
import EventBus from "@/plugins/event-bus";
export default {
  name: "MessageHeader",
  components: {
    UserList
  },
  props: {
    showSettings: {
      type: Boolean,
      required: false,
      default: false
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    tab: {
      type: String,
      required: false,
      default: "Přátele"
    },
    currentChat: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  watch: {
    show(val) {
      this.$emit("update:show", val);
    }
  },
  mounted() {
    EventBus.$on("show-search", () => {
      this.$emit("update:show-search", !this.showSearch);
      this.showUserList();
    });
  },
  methods: {
    showUserList() {
      this.$emit("update:show", true);
    },
    openModal() {
      this.$emit("update:show-settings", !this.showSettings);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-header";
</style>
