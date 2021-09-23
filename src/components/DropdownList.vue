<template>
  <div class="dropdown-list-wrapper">
    <button @click="openDropdown">
      <img v-if="src && !isLabel" :src="src" alt="profile-image" />
      <img
        v-else-if="!isLabel"
        src="img/more-vertical.svg"
        alt="more-horizontal"
      />
      <slot v-if="isLabel" name="label"></slot>
    </button>
    <ul v-if="show" class="dropdown-list" :style="style">
      <li
        v-for="(item, index) in items"
        :key="index"
        :style="{
          borderBottom: item.hasBorder ? '1px solid #F3F3F3' : null,
          paddingBottom: item.hasBorder ? '17px' : null
        }"
      >
        <div
          class="left-side"
          @click="
            item.type === 'action' ? actionHandler(item) : toLink(item.link)
          "
        >
          <span v-if="item.type === 'action'" :style="{ color: item.color }">{{
            item.label
          }}</span>
          <span v-else :style="{ color: item.color }">{{ item.label }}</span>
        </div>
        <div v-if="item.src" class="right-side">
          <img :src="item.src" alt="" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DropdownList",
  props: {
    items: {
      type: [Array, Function],
      required: false,
      default: () => []
    },
    src: {
      type: String,
      required: false,
      default: null
    },
    isLabel: {
      type: Boolean,
      default: false
    },
    indexNumber: {
      type: Number,
      required: false,
      default: null
    },
    top: {
      type: String,
      required: false,
      default: null
    },
    left: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    style() {
      return {
        top: this.top ? this.top : "48px",
        left: this.left ? this.left : "-120px"
      };
    }
  },
  watch: {
    $route(val) {
      this.show = false;
    }
  },
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.close);
  },
  methods: {
    openDropdown() {
      this.show = !this.show;
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.show = false;
      }
    },
    actionHandler(item) {
      this.$emit("action", item, this.indexNumber);
      this.show = false;
    },
    toLink(link) {
      this.$router.push(link);
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/ui/dropdown-list";
</style>
