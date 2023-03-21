<template lang="pug">
.content.h-full
  canvas#webgl-canvas.w-full.h-full(ref="canvas")
  button.p-2.absolute.bg-yellow-400.top-2.right-2.rounded.text-purple-700(@click="launch") 发射烟花
</template>
<script lang="ts" setup>
import BaseWord from '@/utils/baseScene'
import Firework from '@/utils/firework'
let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
const word = new BaseWord({
  control: true,
})
let fireworks = []
const launch = () => {
  const firework = new Firework(
    `hsl(${Math.floor(Math.random() * 360)},100%,80%)`,
    [
      (Math.random() - 0.5) * 40,
      -(Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
    ]
  )
  word.scene.add(firework.point)
  fireworks.push(firework)
  console.log(fireworks)
}

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
