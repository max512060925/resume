<template lang="pug">
.content.h-full
  canvas#webgl-canvas.w-full.h-full(ref="canvas")
  button.p-2.absolute.bg-yellow-400.top-2.right-2.rounded.text-purple-700(@click="launch") 发射烟花
</template>
<script lang="ts" setup>
import BaseWord from '@/utils/baseScene'
import Firework from '@/utils/firework'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
const word = new BaseWord({
  control: true,
  camera: {
    position: [50, 50, 50],
  },
})
let fireworks = []
const launch = () => {
  const firework = new Firework(
    `hsl(${Math.floor(Math.random() * 360)},100%,80%)`,
    [
      (Math.random() - 0.5) * 10,
      3 + Math.random() * 30,
      (Math.random() - 0.5) * 10,
    ]
  )
  word.scene.add(firework.point)
  word.scene.add(firework.fire)
  fireworks.push(firework)
}
// model
const loader = new GLTFLoader()
loader.load('/models/building/building.glb', ({ scene }) => {
  word.scene.add(scene)
})

onMounted(() => {
  word.start(canvas, box)
  word.animate(() => {
    const elapsedTime = word.clock.getElapsedTime()
    fireworks.forEach((item, i) => {
      item.update()
      // const type = item.update(elapsedTime)
      // if (type == 'remove') {
      //   fireworks.splice(i, 1)
      // }
    })
  })
})
</script>
