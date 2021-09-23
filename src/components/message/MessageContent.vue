<template>
  <div>
    <div
      ref="content"
      class="message-content"
      :class="{
        'correct-height-one': correctHeight === 1,
        'correct-height-two': correctHeight > 1
      }"
      @scroll="chatScroll"
    >
      <Loader v-if="!allLoaded && messages.length > 6" />
      <div class="message-lists">
        <MessageItem
          v-for="(message, index) in messages"
          :key="`${message.message_id}_${index}`"
          :user-type="message.is_mine ? 'me' : 'user'"
          :order="message.is_mine ? 'right' : 'left'"
        >
          <span slot="avatar" class="svg">
            <img :src="message.author.photo" alt="icon" />
          </span>
          <div
            slot="message"
            class="content-item"
            v-html="parserContent(message.content)"
          ></div>
          <span slot="date" class="date">{{
            dateFormat(message.created)
          }}</span>
          <span v-if="message.is_mine" slot="status" class="checkers"></span>
        </MessageItem>
      </div>
    </div>
    <MessageInput @sendMessage="sendMessage" />
  </div>
</template>

<script>
import MessageItem from "@/components/message/MessageItem";
import MessageInput from "@/components/message/MessageInput";
import Loader from "@/components/Loader";
import websockets from "@/mixins/websockets";
import message from "@/mixins/message";
import EventBus from "@/plugins/event-bus";
export default {
  name: "MessageContent",
  components: {
    MessageItem,
    MessageInput,
    Loader
  },
  mixins: [websockets, message],
  props: {
    messages: {
      type: Array,
      required: false,
      default: () => []
    },
    currentChat: {
      type: Object,
      required: false,
      default: () => {}
    },
    allLoaded: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    correctHeight() {
      return this.$store.state.correctHeight;
    },
    externalChatId() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    dateFormat() {
      return date => {
        const messageDate = this.$moment(date).startOf("day");
        const diff = this.$moment()
          .startOf("day")
          .diff(messageDate, "days");
        if (diff === 0) return this.$moment(date).format("HH:mm");
        if (diff === 1) return "Yesterday";
        if (diff >= 2) return this.$moment(date).format("D MMM");
      };
    }
  },
  watch: {
    currentChat() {
      this.scrollToBottom();
    }
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.content) {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight + 372;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/message/message-content";
</style>
