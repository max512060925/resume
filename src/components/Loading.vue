<template lang="pug">
.loading-wrapper
  .content
    .bar(:style='{ transform: `translateX(${percentage * 100 - 100}%)` }')
</template>
<script lang="ts" setup>
defineProps<{ percentage: number }>()
</script>
<style lang="scss" scoped>
.loading-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 500;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  background-color: #fafafa;
  .content {
    width: 50%;
    height: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    border: 4px solid #14b8a6;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    overflow: hidden;
    .bar {
      width: 100%;
      top: 0;
      position: absolute;
      height: 100%;
      transform: translate(0);
      background-size: 30px 30px;
      border-radius: 30px;
      overflow: hidden;
      background-image: linear-gradient(
        -45deg,
        #fde68a,
        #fde68a 25%,
        #ec4899 25%,
        #ec4899 50%,
        #fde68a 50%,
        #fde68a 75%,
        #ec4899 75%,
        #ec4899 100%
      );
      animation: animate 0.5s linear infinite;
      filter: blur(1px);
      transition: 0.2s linear;
    }
    @keyframes animate {
      0% {
      }
      100% {
        background-position: 30px 0;
      }
    }
  }
}
</style>
