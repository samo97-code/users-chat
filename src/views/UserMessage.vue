<template>
  <div class="messages-wrapper">
    <img class="banner-bg" src="img/messages-background.svg" alt="" />
    <div class="left-sidebar user-left">
      <MessageLeftSidebar :show-search.sync="showSearch" :tab.sync="tab" />
    </div>
    <div class="content user-content">
      <MessageHeader
        :show-settings.sync="showSettings"
        :show.sync="show"
        :show-search.sync="showSearch"
        :tab="tab"
        :current-chat="currentChat"
      />
      <MessageContent
        v-if="!showSearch"
        :messages="messages"
        :current-chat="currentChat"
        :all-loaded="allLoaded"
        @run-pager="runPager"
      />
      <GroupSettings
        :show-settings.sync="showSettings"
        :show-search.sync="showSearch"
        :current-chat="currentChat"
      />
    </div>
  </div>
</template>

<script>
import MessageLeftSidebar from "@/components/message/MessageLeftSidebar";
import MessageContent from "@/components/message/MessageContent";
import MessageHeader from "@/components/message/MessageHeader";
import GroupSettings from "@/components/settings/GroupSettings";
import EventBus from "@/plugins/event-bus";
export default {
  name: "UserMessage",
  components: {
    MessageLeftSidebar,
    MessageContent,
    MessageHeader,
    GroupSettings
  },
  data() {
    return {
      showSettings: false,
      show: false,
      showSearch: false,
      tab: "Přátele",
      messages: [],
      messageLimit: 15,
      totalCount: 0,
      allLoaded: false,
      loading: false,
      loaded: [],
      currentChat: {}
    };
  },
  watch: {
    $route(val) {
      if (localStorage.getItem("addUser")) {
        localStorage.removeItem("addUser");
      }
      this.fetchChat();
      this.fetchMessages();
      this.loaded = [];
    }
  },
  created() {
    if (localStorage.getItem("tab")) {
      this.tab = localStorage.getItem("tab");
    }
    if (this.$route.name === "UserMessage") {
      this.fetchMessages();
      this.fetchChat();
    }
  },
  beforeDestroy() {
    EventBus.$off("update-current-chat");
    EventBus.$off("update-messages");
  },
  mounted() {
    EventBus.$on("update-current-chat", () => {
      this.fetchChat();
    });
    EventBus.$on("update-messages", () => {
      this.fetchMessages();
    });
  },
  methods: {
    async fetchMessages() {
      try {
        const data = {
          chat_id: this.$route.params.id
        };
        const resp = await this.$store.dispatch("messages/list", data);
        this.messages = resp.data.messages.reverse();
        this.totalCount = resp.data.total_count;
        this.allLoaded = resp.data.messages.length === this.totalCount;
      } catch (e) {}
    },
    async fetchChat() {
      try {
        const resp = await this.$store.dispatch("chats/chatMembers", {
          chat_id: this.$route.params.id
        });
        this.currentChat = resp.data;
      } catch (e) {}
    },
    async runPager() {
      if (this.allLoaded || this.isLoading) {
        return;
      }
      this.loading = true;
      const oldDataReverse = [...this.messages].reverse();
      const lastMessage = oldDataReverse[oldDataReverse.length - 1];
      if (this.loaded.includes(lastMessage.message_id)) {
        return;
      }
      try {
        this.loaded.push(lastMessage.message_id);
        const response = await this.$store.dispatch("messages/list", {
          chat_id: this.$route.params.id,
          limit: this.messageLimit,
          show_from: lastMessage.message_id
        });
        if (response.data.messages.length) {
          response.data.messages.map(item => {
            this.messages.unshift(item);
          });
        }
        this.allLoaded = this.messages.length === this.totalCount;

        const allItems = [
          ...document.getElementsByClassName("message-wrapper")
        ];
        allItems[this.messageLimit - 10].scrollIntoView();
      } catch (e) {
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-wrapper";
</style>
