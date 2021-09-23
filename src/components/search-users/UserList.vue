<template>
  <div class="user-lists">
    <Multiselect
      v-model="selected"
      class="multyselect"
      :options="friends"
      placeholder="Komu"
      :multiple="tab !== 'Přátele'"
      label="name"
      track-by="name"
    >
      <template slot="option" slot-scope="props">
        <img class="option__image" :src="props.option.photo" />
        <div class="option__desc">
          <span class="option__title">{{ props.option.name }}</span>
        </div>
      </template>
    </Multiselect>
    <button v-if="selected.length" class="create-btn" @click="createChat">
      <img src="img/create.svg" alt="close" />
    </button>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import EventBus from "@/plugins/event-bus";
export default {
  name: "UserList",
  components: {
    Multiselect
  },
  props: {
    tab: {
      type: String,
      required: false,
      default: "Přátele"
    }
  },
  data() {
    return {
      selected: [],
      friends: []
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    createChat() {
      if (this.tab === "Přátele") this.createSingle();
      else this.createGroup();
    },
    async createSingle() {
      if (this.selected) {
        try {
          const resp = await this.$store.dispatch("chats/createSingle", {
            opponent_id: this.selected.external_id
          });
          EventBus.$emit("create-new-chat", resp.data);
          this.selected = null;
        } catch (e) {}
      }
    },

    async createGroup() {
      if (this.selected && this.selected.length) {
        if (localStorage.getItem("addUser")) {
          await this.updateGroup();
          return;
        }

        try {
          const user = this.$cookies.get("user");
          let memberIds = [];
          this.selected.map(item => {
            memberIds = [...memberIds, item.external_id];
          });

          const data = {
            members: JSON.stringify(memberIds),
            name: user.name
          };
          const resp = await this.$store.dispatch("chats/createGroup", data);
          EventBus.$emit("create-new-chat", resp.data);
          EventBus.$emit("show-search");
          this.selected = null;
        } catch (e) {}
      }
    },

    async updateGroup() {
      if (this.selected && this.selected.length) {
        try {
          let memberIds = [];
          this.selected.map(item => {
            memberIds = [...memberIds, item.external_id];
          });

          const data = {
            user_ids: memberIds,
            chat_id: this.$route.params.id
          };
          await this.$store.dispatch("chats/addUsers", data);
          EventBus.$emit("update-current-chat");
          EventBus.$emit("show-search");
          this.selected = null;
        } catch (e) {
        } finally {
          localStorage.removeItem("addUser");
        }
      }
    },

    async fetchUsers() {
      try {
        const resp = await this.$store.dispatch("users/friends");
        this.friends = resp.data.friends;
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss">
@import "src/assets/scss/ui/multyselect";
</style>
<style lang="scss" scoped>
@import "src/assets/scss/search/user-list";
</style>
