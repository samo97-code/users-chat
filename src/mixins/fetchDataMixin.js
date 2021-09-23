export default {
  methods: {
    async fetchChat() {
      try {
        const resp = await this.$store.dispatch("chats/list");
        resp.data.chats.map(item => {
          if (item.is_group) {
            this.groupChats = [...this.groupChats, item];
          } else this.singleChats = [...this.singleChats, item];
        });
      } catch (e) {}
    }
  }
};
