<template lang="pug">
.card(:style='ratio ? `aspect-ratio:${ratio}` : "unset"', ref='card')
  .content
    slot
</template>
<script lang="ts" setup>
const card = ref<HTMLDivElement>()
const parallax = reactive(useParallax(card))
defineProps<{ ratio?: `${number}/${number}` }>()
</script>
<style lang="scss" scoped>
.card {
  --x: v-bind('parallax.tilt');
  --y: v-bind('parallax.roll');
  @apply rounded-4 overflow-hidden shadow-[rgb(0_0_0/0.66)_0_30px_60px_0] duration-1000 ease-[cubic-bezier(0.445,0.05,0.55,0.95)];

  &:hover {
    @apply shadow-[rgb(255_255_255/0.2)_0_0_40px_5px,rgb(0_0_0/0.66)_0_30px_60px_0];
    transition:
      0.6s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1);
    transform: rotate3d(var(--x), var(--y), 0, -20deg);
    .content {
      transition: inherit;
      @apply translate-x-[calc(var(--x)*20px)] translate-y-[calc(var(--x)*20px)];
    }
  }
  .content {
    @apply text-white w-full h-full
    duration-1000 ease-[cubic-bezier(0.445,0.05,0.55,0.95)];
  }
}
</style>
