<template lang="pug">
.w-full.h-full(ref='box')
  Loading(:percentage='percentage', :load-text='loadText', v-if='!loading')
  .absolute.bottom-5(v-else, class='w-11/12 left-1/2 -translate-x-1/2')
    component.text-900.cursor-pointer(
      :is='defineComponent(start ? IconPause : IconPlay)',
      @click='play',
      class='!text-[5vmin]'
    )
  canvas.w-full.h-full(ref='canvas')
</template>
<script lang="ts" setup>
import { Vector3, Group } from 'three'
import IconPlay from '~icons/icon/play'
import IconPause from '~icons/icon/pause'
import MMD from '@/utils/mmd'
useHead({
  title: '刻晴',
  script: [{ src: '/ammo/ammo.wasm.js', defer: true }],
})

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let start = $ref(false)
let loading = $ref(true)
let percentage = $ref(0)
let loadText = $ref('')

const word = new BaseWord({
  control: true,
  camera: {
    fov: 45,
    near: 0.1,
    far: 100,
    position: [50, 50, 500],
  },
  directional: {
    color: '#fff',
    intensity: 0.7,
  },
})
const mmd = new MMD()

const play = () => {
  start = !start
  start ? mmd.audio?.play() : mmd.audio?.pause()
}
onMounted(async () => {
  const { Ammo } = window
  await Ammo()
  word.start(canvas)
  const [mesh] = await Promise.all([
    mmd.loadModelAndAnimation({
      pmx: '/models/keqing/keqing.pmx',
      vmd: '/models/keqing/motion.vmd',
    }),
    mmd.loadCameraMotion('/models/keqing/camera.vmd', word.camera),
    mmd.loadAudio('/models/keqing/summertime.wav', word.camera),
  ])
  const scale = 0.4
  mesh.geometry.computeBoundingBox()
  const group = new Group()
  group.add(mesh)
  group.scale.set(scale, scale, scale)
  word.scene.add(group)
  const centerY =
    ((mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y) / 2) *
    scale
  word.camera.position.set(mesh.position.x, centerY, 20)
  word.control.target = new Vector3(mesh.position.x, centerY, mesh.position.z)
  word.camera.lookAt(new Vector3(mesh.position.x, centerY, mesh.position.z))
  word.animate(() =>
    start ? mmd.update(word.clock.getDelta()) : word.control.update()
  )
  word.watchResize(box)
})
</script>
