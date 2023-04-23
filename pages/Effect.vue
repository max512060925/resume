<template lang="pug">
.w-full.h-full(ref='box')
  canvas#webgl-canvas(ref='canvas')
</template>
<script lang="ts" setup>
import {
  CubeTextureLoader,
  CubeRefractionMapping,
  ACESFilmicToneMapping,
} from 'three'
 
let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
const word = new BaseWord({ control: true })
// 添加环境纹理

onMounted(() => {
  word.start(canvas, box)
  word.renderer.toneMapping = ACESFilmicToneMapping
  const envMap = new CubeTextureLoader().load([
    '/textures/environment/0/px.jpg',
    '/textures/environment/0/nx.jpg',
    '/textures/environment/0/py.jpg',
    '/textures/environment/0/ny.jpg',
    '/textures/environment/0/pz.jpg',
    '/textures/environment/0/nz.jpg',
  ])
  envMap.mapping = CubeRefractionMapping
  word.scene.background = envMap
  word.scene.environment = envMap
  word.animate()
})
</script>
