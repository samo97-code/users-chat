<template>
  <div class="messages-wrapper">
    <img class="banner-bg" src="img/messages-background.svg" alt="" />
    <div class="left-sidebar">
      <MessageLeftSidebar :show-search.sync="showSearch" :tab.sync="tab" />
    </div>
    <div class="content">
      <MessageHeader
        :show-settings.sync="showSettings"
        :show.sync="show"
        :show-search.sync="showSearch"
        :tab="tab"
      />
      <GroupSettings
        :show-settings.sync="showSettings"
        :show-search.sync="showSearch"
      />
    </div>
  </div>
</template>

<script>
import MessageLeftSidebar from "@/components/message/MessageLeftSidebar";
import MessageHeader from "@/components/message/MessageHeader";
import GroupSettings from "@/components/settings/GroupSettings";
import axios from "axios";
export default {
  name: "Messages",
  components: {
    MessageLeftSidebar,
    MessageHeader,
    GroupSettings
  },
  data() {
    return {
      showSettings: false,
      show: false,
      showSearch: false,
      tab: "Přátele"
    };
  },
  async created() {
    if (localStorage.getItem("tab")) {
      this.tab = localStorage.getItem("tab");
    }
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const resp = await this.$store.dispatch("users/profile", {
          token: this.$cookies.get("token")
        });
        await this.$cookies.set("user", resp.data);
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-wrapper";
</style>
