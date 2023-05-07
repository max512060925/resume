<template lang="pug">
.content.h-full(ref='box')
  canvas#webgl-canvas.w-full.h-full(ref='canvas')
  button.p-2.absolute.bg-yellow-400.top-4.right-4.rounded.text-purple-700(
    @click='launch'
  ) 发射烟花
</template>
<script lang="ts" setup>
import {
  ACESFilmicToneMapping,
  PlaneGeometry,
  TextureLoader,
  RepeatWrapping,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Water } from 'three/examples/jsm/objects/Water2.js'
useHead({
  title: '放烟花',
})

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
const word = new BaseWord({
  control: true,
  camera: {
    position: [50, 50, 50],
  },
  ambient: {
    color: '#fed7aa',
    intensity: 0.7,
  },
})
let fireworks = []
const launch = () => {
  const firework = new Firework(
    `hsl(${Math.floor(Math.random() * 360)},100%,80%)`,
    [
      (Math.random() - 0.5) * 20,
      20 + Math.random() * 10,
      (Math.random() - 0.5) * 20,
    ]
  )
  word.scene.add(firework.point)
  word.scene.add(firework.fire)
  fireworks.push(firework)
}
// model
const loader = new GLTFLoader()
// building
loader.load('/models/building/building.glb', ({ scene }) =>
  word.scene.add(scene)
)
const textureLoader = new TextureLoader()

onMounted(() => {
  word.start(canvas)
  word.renderer.toneMapping = ACESFilmicToneMapping
  word.animate(() => {
    fireworks.forEach((item, i) =>
      item.update(() => {
        word.scene.remove(item.point)
        word.scene.remove(item.fire)
        fireworks.splice(i, 1)
      })
    )
  })
  const water = new Water(new PlaneGeometry(68, 80), {
    color: '#bae6fd',
    scale: 2,
    textureHeight: 1024,
    textureWidth: 1024,
    normalMap0: textureLoader.load('/textures/water/Water_1_M_Normal.jpg'),
    normalMap1: textureLoader.load('/textures/water/Water_2_M_Normal.jpg'),
  })
  water.position.y = 1
  water.rotation.x = -Math.PI / 2
  word.scene.add(water)
  // const water = new Water(new PlaneGeometry(68, 80), {
  //   textureWidth: 1024,
  //   textureHeight: 1024,
  //   waterNormals: textureLoader.load(
  //     '/imgs/textures/water/waternormals.jpg',
  //     texture => {
  //       texture.wrapS = texture.wrapT = RepeatWrapping
  //     }
  //   ),
  //   // sunDirection: new  Vector3(),
  //   sunColor: 0xffffff,
  //   waterColor: 0x001e0f,
  //   distortionScale: 3.7,
  //   fog: word.scene.fog !== undefined,
  // })
  water.rotation.x = -Math.PI / 2
  water.position.y = 1
  word.scene.add(water)
  word.watchResize(box)
})
</script>
