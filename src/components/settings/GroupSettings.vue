<template>
  <div v-if="showSettings" class="group-settings-wrapper">
    <div class="header">
      <button class="close-btn" @click="closeModal">
        <img src=img/close-user-list.svg alt="close">
      </button>
      <h5>Nastavení skupiny</h5>
      <div class="user-block">
        <label class="image-block">
          <img :src="groupImage" alt="user-avatar" />
          <input type="file" @change="onFileUpload" />
        </label>
        <span class="user-name">
          <input v-model="groupName" type="text" @keyup="updateGroup(null)" />
        </span>
      </div>
    </div>
    <div class="users-list">
      <div class="title">
        <h6>Účastníci</h6>
      </div>
      <ul class="ul-list" :class="{ 'scroll-list': members.length > 3 }">
        <li v-for="(member, index) in members" :key="member.external_id">
          <div class="left-side">
            <span class="user-image">
              <img :src="member.photo" alt="user-avatar" />
            </span>
            <span class="username">{{ member.name }}</span>
          </div>
          <div class="right-side">
            <DropdownList
              :items="[
                {
                  label: 'Odstranit uživatele ze skupiny',
                  type: 'action',
                  actionName: 'delete',
                  id: member.external_id,
                  index
                }
              ]"
              :is-label="false"
              :top="'32px'"
              :left="'-156px'"
              @action="actionHandler"
            />
          </div>
        </li>
      </ul>
      <ul class="fixed-list">
        <li>
          <div class="left-side">
            <span class="user-image">
              <img :src="admin.photo" alt="user-avatar" />
            </span>
            <span class="username">{{ admin.name }}</span>
          </div>
          <div class="right-side">
            <span>Admin</span>
          </div>
        </li>
        <li>
          <div class="left-side">
            <span class="user-image">
              <img src="img/new-member.svg" alt="user-avatar" />
            </span>
            <span class="username">Přidat další účastníky</span>
          </div>
          <div class="right-side">
            <button class="plus-btn-image" @click="addNewMember">
              <img
                src="img/chevron-right.svg"
                alt="link-icon"
                class="plus-btn-image"
              />
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="leave-block">
      <div class="content">
        <div class="parent-block" @click="leaveGroup">
          <span class="user-image">
            <img src="img/leave-group.svg" alt="user-avatar" />
          </span>
          <span class="username">Odejít ze skupiny</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DropdownList from "@/components/DropdownList";
import EventBus from "@/plugins/event-bus";
import fetchDataMixin from "@/mixins/fetchDataMixin";
export default {
  name: "GroupSettings",
  components: {
    DropdownList
  },
  mixins: [fetchDataMixin],
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
    currentChat: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      groupName: "",
      groupImage: ""
    };
  },
  computed: {
    members() {
      return this.currentChat.members.filter(
        item => item.external_id !== this.currentChat.admin_id
      );
    },
    admin() {
      return this.currentChat.members.filter(
        item => item.external_id === this.currentChat.admin_id
      )[0];
    }
  },
  watch: {
    currentChat(val) {
      this.groupName = val.name;
      this.groupImage = val.img_url;
    }
  },
  created() {
    this.groupName = this.currentChat ? this.currentChat.name : "";
    this.groupImage = this.currentChat ? this.currentChat.img_url : "";
  },
  methods: {
    onFileUpload(e) {
      const file = e.target.files || e.dataTransfer.files;
      if (!file.length) return;
      this.updateGroup(file[0]);
    },
    updateGroup(file) {
      setTimeout(async () => {
        try {
          const data = {
            data: {
              chat_id: this.$route.params.id,
              name: this.groupName
            }
          };
          if (file) data.file = { photo: file };

          const resp = await this.$store.dispatch("chats/update", data);
          EventBus.$emit("update-group-chat", resp.data);
          if (file) this.groupImage = resp.data.img_url;
        } catch (e) {}
      }, 500);
    },
    async actionHandler(item) {
      try {
        const data = {
          chat_id: this.$route.params.id,
          user_id: item.id
        };
        await this.$store.dispatch("chats/removeUser", data);
        EventBus.$emit("update-current-chat");
      } catch (e) {}
    },
    addNewMember() {
      EventBus.$emit("show-search");
      EventBus.$emit("show-new-user");
      this.closeModal();
      localStorage.setItem("addUser", true);
    },
    closeModal() {
      this.$emit("update:show-settings", false);
    },
    async leaveGroup() {
      try {
        await this.$store.dispatch("chats/chatLeave", {
          chat_id: this.$route.params.id
        });
        await this.$router.push("/messages");
        await this.closeModal();
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/settings/group-settings";
</style>
