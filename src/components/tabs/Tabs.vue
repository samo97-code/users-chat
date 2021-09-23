<template>
  <div>
    <div class="custom-tabs">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ 'is-active': tab.isActive }"
          @click="selectTab(tab)"
        >
          <a class="link">{{ tab.name }}</a>
        </li>
      </ul>
    </div>

    <div
      class="tabs-details"
      :class="{
        'scrollbar-height': showSearchMobile
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    showSearchMobile: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return { tabs: [] };
  },

  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.$emit("get-tab", selectedTab.name);
      this.tabs.forEach(tab => {
        tab.isActive = tab.name === selectedTab.name;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/tabs";
</style>
