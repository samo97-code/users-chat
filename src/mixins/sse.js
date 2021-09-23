export default {
  data() {
    return {
      onlineUsers: [],
      sseEndpoint: "/sse/with_query/updates",
      source: null,
      connected: false,
      reconnectTimeOut: 10 * 1000
    };
  },
  created() {},
  methods: {
    sseConnect() {
      if (this.connected && this.source) {
        return true;
      }
      const token = this.$cookies.get("token");
      const url =
        process.env.VUE_APP_API + this.sseEndpoint + `?token=${token}`;

      const closeConnection = () => {
        if (!this.source) {
          return;
        }
        this.source.close();
        this.source = null;
        this.connected = false;
        setTimeout(() => {
          this.sseConnect();
        }, this.reconnectTimeOut);
      };

      this.source = new EventSource(url);

      this.source.addEventListener("end", event => {
        closeConnection();
      });
      this.source.onerror = function(event) {
        closeConnection();
      };
      this.connected = true;
      this.source.addEventListener("message", event => {
        let data = null;
        try {
          const str = event.data.replace("b'", "").slice(0, -1);
          data = JSON.parse(str);
        } catch (e) {
          data = JSON.parse(event.data);
        }
        this.onlineUsers = data.user_ids;
      });
    }
  }
};
