<template lang="pug">
svg.svg-icon(v-bind='$attrs', aria-hidden)
  use(:xlink:href='`#icon-${name}`')
</template>
<script lang="ts" setup>
defineProps<{ name: string }>()
</script>
<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: none;
}
</style>
