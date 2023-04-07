<template lang="pug">
.card(@mousemove='mousemove', @mouseleave='mouseleave')
  .content
    slot
</template>
<script lang="ts" setup>
withDefaults(defineProps<{ ratio?: `${number}/${number}` }>(), {
  ratio: '3/4',
})
let move = shallowReactive({
  x: 0,
  y: 0,
})
const mousemove = e => {
  const width = e.target.clientWidth
  const height = e.target.clientHeight
  move.x = (e.offsetX - width / 2) / width
  move.y = (e.offsetY - height / 2) / height
}
const mouseleave = () => {
  move.x = 0
  move.y = 0
}
</script>
<style lang="scss" scoped>
.card {
  @apply relative aspect-[v-bind(ratio)] rounded-[10px] overflow-hidden shadow-[rgb(0_0_0/0.66)_0_30px_60px_0] duration-1000 ease-[cubic-bezier(0.445,0.05,0.55,0.95)] cursor-pointer;
  transform: rotateX(calc(v-bind('move.x') * -20deg))
    rotateY(calc(v-bind('move.y') * -20deg));
  &:hover {
    @apply shadow-[rgb(255_255_255/0.2)_0_0_40px_5px,rgb(0_0_0/0.66)_0_30px_60px_0];
    transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1);
    .content {
      transition: inherit;
    }
  }
  .content {
    @apply text-white w-full h-full absolute -top-[20px] -left-[20px] p-5 
    duration-1000 ease-[cubic-bezier(0.445,0.05,0.55,0.95)] 
    translate-x-[calc(v-bind('move.x')*20px)] translate-y-[calc(v-bind('move.y')*20px)];
  }
}
</style>
