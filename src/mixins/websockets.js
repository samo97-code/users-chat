import EventBus from "@/plugins/event-bus";

export default {
  data() {
    return {
      websocketConnection: null,
      websocketConnectionTimeOut: null,
      newWebsocketMessage: null,
      connectionTimeout: 10000
    };
  },

  watch: {
    async externalChatId() {
      await this.websocketConnect();
    }
  },
  async mounted() {
    if (!this.websocketConnection) {
      await this.websocketConnect();
    }
  },
  methods: {
    async websocketConnect() {
      const token = this.$cookies.get("token");
      const self = this;
      const apiEndpoint = `${
        process.env.VUE_APP_API_WEBSOCKETS
      }/${this.getChatId()}?token=${token}`;
      try {
        this.websocketConnection = new WebSocket(apiEndpoint);
        this.websocketConnectionTimeOut = null;
      } catch (e) {
        console.log("Not able to connect to the websockets", e);
      }

      this.websocketConnection.onmessage = async event => {
        this.newWebsocketMessage = JSON.parse(event.data);
        await EventBus.$emit("update-messages");
        setTimeout(async () => {
          await this.scrollToBottom();
        }, 500);
      };
      this.websocketConnection.onerror = event => {
        self.websocketOnError();
      };
      this.websocketConnection.onclose = event => {
        self.websocketOnClose();
      };
      this.websocketConnection.onopen = function(event) {
        self.websocketOnOpen();
      };
    },
    websocketOnError() {
      const self = this;
      self.websocketConnectionTimeOut = setTimeout(async function() {
        await self.websocketConnect();
      }, self.connectionTimeout);
    },
    websocketOnClose() {
      const self = this;
      self.websocketConnectionTimeOut = setTimeout(async function() {
        await self.websocketConnect();
      }, self.connectionTimeout);
    },
    websocketOnOpen() {},
    getChatId() {
      return this.externalChatId;
    },
    async sendMessage(media, files, textMessage) {
      const message = this.formatMessage(files, media, textMessage);
      await this.websocketConnection.send(message);
    },
    formatMessage(files, media, textMessage) {
      const data = {
        content: textMessage + " " + media.join(" ") + " " + files.join(" ")
      };
      return JSON.stringify(data);
    }
  }
};
