<template>
  <div class="lds-dual-ring"></div>
</template>

<script>
export default {
  name: "Loader"
};
</script>

<style lang="scss" scoped>
.lds-dual-ring {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: block;
}
.lds-dual-ring::after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #cef;
  border-color: #cef transparent #cef transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
