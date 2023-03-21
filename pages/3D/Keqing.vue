<template lang="pug">
.container(ref='box')
  Loading(:percentage='percentage', :load-text='loadText', v-if='loading')
  .btn-box(v-else)
    SvgIcon(:name='start ? "pause" : "play"', @click='start = !start')
  canvas#webgl-canvas(ref='canvas')
</template>
<script lang="ts" setup>
useHead({
  title: '刻晴',
  script: [{ src: '/ammo/ammo.wasm.js' }],
})

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let start = $ref(false)
let loading = $ref(true)
let percentage = $ref(0)
let loadText = $ref('')
</script>
