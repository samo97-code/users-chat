<template>
  <div class="message-left-sidebar">
    <div class="header">
      <button class="back-btn" @click="$router.push('/messages')">
        <img src="img/back-btn.svg" alt="back" />
      </button>
      <span class="image-block">
        <img
          v-if="$cookies.get('user')"
          :src="$cookies.get('user').photo"
          alt="avatar"
        />
      </span>
      <span class="title">
        Chat
      </span>
      <button class="plus-btn" @click="openSearch">
        <img src="img/plus.svg" alt="plus" class="plus-btn-image" />
      </button>
      <button class="plus-btn-mobile" @click="openSearchMobile">
        <img src="img/plus.svg" alt="plus" class="plus-btn-image" />
      </button>
    </div>
    <div v-if="showSearchMobile" class="search-bar">
      <div class="label">Komu:</div>
      <UserList :tab="tab" />
    </div>
    <div class="users-list">
      <Tabs :show-search-mobile="showSearchMobile" @get-tab="getTab">
        <Tab name="Přátele" :selected="tab === 'Přátele'">
          <UserMessageItem
            v-if="showNewUser"
            class="user-item-panel"
            :is-active="true"
          >
            <img slot="avatar" src="img/new-user.svg" alt="new-user" />
            <span slot="full-name" class="full-name">
              Nová zpráva
            </span>
            <button slot="date" class="date close-icon" @click="closeNewChat">
              <img src="/img/close-user-list.svg" alt="close" />
            </button>
          </UserMessageItem>
          <UserMessageItem
            v-for="(chat, index) in singleChats"
            :key="`${chat.chat_id}_${index}`"
            class="user-item-panel"
            :is-active="!showNewUser && chat.chat_id === $route.params.id"
            :is-online="getIsOnline(chat)"
            @on-click="toLink(`/messages/${chat.chat_id}`)"
          >
            <img slot="avatar" :src="chat.img_url" alt="user-avatar" />
            <span slot="full-name" class="full-name">
              {{ chat.name }}
            </span>
          </UserMessageItem>
        </Tab>
        <Tab name="Konverzace" :selected="tab === 'Konverzace'">
          <UserMessageItem
            v-if="showNewUser"
            class="user-item-panel"
            :is-active="true"
          >
            <img slot="avatar" src="img/new-user.svg" alt="new-user" />
            <span slot="full-name" class="full-name">
              Nová zpráva
            </span>
            <button slot="date" class="date close-icon" @click="closeNewChat">
              <img src="/img/close-user-list.svg" alt="close" />
            </button>
          </UserMessageItem>
          <UserMessageItem
            v-for="(chat, index) in groupChats"
            :key="`${chat.chat_id}_${index}`"
            class="user-item-panel"
            :is-online="getIsOnline(chat)"
            :is-active="!showNewUser && chat.chat_id === $route.params.id"
            @on-click="toLink(`/messages/${chat.chat_id}`)"
          >
            <img slot="avatar" :src="chat.img_url" alt="user-avatar" />
            <span slot="full-name" class="full-name">
              {{ chat.name }}
            </span>
            <span
              v-if="chat.last_message"
              slot="description"
              class="description"
              >{{ formatContent(chat.last_message.content) }}</span
            >
            <span v-if="chat.last_message" slot="date" class="date">{{
              dateFormat(chat.last_message.created)
            }}</span>
            <span slot="read" class="read">
              <img src="img/grey-read.svg" alt="read" />
            </span>
          </UserMessageItem>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/tabs/Tabs";
import Tab from "@/components/tabs/Tab";
import UserMessageItem from "@/components/message/UserMessageItem";
import UserList from "@/components/search-users/UserList";
import EventBus from "@/plugins/event-bus";
import sse from "@/mixins/sse";

export default {
  name: "MessageLeftSidebar",
  components: {
    Tabs,
    Tab,
    UserMessageItem,
    UserList
  },
  mixins: [sse],
  props: {
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    tab: {
      type: String,
      required: false,
      default: "Přátele"
    }
  },
  data() {
    return {
      showNewUser: false,
      showSearchMobile: false,
      show: false,
      singleChats: [],
      groupChats: []
    };
  },
  computed: {
    formatContent() {
      return content => {
        const text = content.replace(
          /(((ftp|http|www|https?):\/\/)[-\w@:%_+.~#?,&//=]+)/g,
          ""
        );
        return text && text.length > 40 ? text.substr(0, 40) + " ..." : text;
      };
    },
    dateFormat() {
      return date => {
        const messageDate = this.$moment(date)
          .local()
          .startOf("day");
        const diff = this.$moment()
          .local()
          .startOf("day")
          .diff(messageDate, "days");
        if (diff === 0)
          return (
            "Today " +
            this.$moment(date)
              .local()
              .format("HH:mm")
          );
        if (diff === 1)
          return (
            "Yesterday " +
            this.$moment(date)
              .local()
              .format("HH:mm")
          );
        if (diff >= 2)
          return this.$moment(date)
            .local()
            .format("D MMM");
      };
    },
    getIsOnline() {
      return chat => {
        if (chat.is_group === true && chat.members_ids.length > 2) {
          return false;
        }
        const me = this.$cookies.get("user");
        const members = chat.members_ids;
        const memberId = members.filter(x => x !== me.external_id)[0];
        return this.onlineUsers.includes(memberId);
      };
    }
  },
  async created() {
    await this.sseConnect();
    await this.fetchChat();
  },
  beforeDestroy() {
    EventBus.$off("show-new-user");
    EventBus.$off("create-new-chat");
    EventBus.$off("update-group-chat");
  },
  mounted() {
    EventBus.$on("show-new-user", () => {
      this.showNewUser = false;
    });
    EventBus.$on("create-new-chat", newChat => {
      if (this.tab === "Přátele") {
        this.singleChats.unshift(newChat);
      } else this.groupChats.unshift(newChat);
      this.showNewUser = false;
    });
    EventBus.$on("update-group-chat", updatedChat => {
      let newChat = this.groupChats.filter(
        item => item.chat_id === updatedChat.chat_id
      )[0];
      newChat.name = updatedChat.name;
      newChat.img_url = updatedChat.img_url;
    });
  },
  methods: {
    async fetchChat() {
      try {
        const resp = await this.$store.dispatch("chats/list");
        resp.data.chats.map(item => {
          if (item.is_group) {
            this.groupChats = [...this.groupChats, item];
          } else this.singleChats = [...this.singleChats, item];
        });
      } catch (e) {
        console.log(e);
      }
    },
    getTab(name) {
      this.$emit("update:tab", name);
      localStorage.setItem("tab", name);
    },
    toLink(link) {
      this.$router.push(link);
    },
    openSearch() {
      EventBus.$emit("show-search");
      if (this.showSearch) {
        this.showNewUser = false;
      } else this.showNewUser = !this.showNewUser;
    },
    closeNewChat() {
      EventBus.$emit("show-search");
      this.showNewUser = false;
      this.showSearchMobile = false;
    },
    openSearchMobile() {
      this.showSearchMobile = !this.showSearchMobile;
      this.showNewUser = !this.showNewUser;
      this.showUserList();
    },
    showUserList() {
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-left-sidebar";
</style>
