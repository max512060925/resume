<script setup lang="ts">
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  LoadingManager,
  TextureLoader,
  SphereGeometry,
  sRGBEncoding,
  VideoTexture,
  CircleGeometry,
  Vector2,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water2.js' //水面
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let loading = $ref(false)
let width = $ref(0)
let renderer: WebGLRenderer
let control: OrbitControls
const scene = new Scene() //场景
const camera = new PerspectiveCamera(75, 1, 0.1, 2000) // 相机

camera.position.set(-50, 50, 130)

const manger = new LoadingManager(
  () => {
    render()
    loading = false
  },
  (url: string, loaded: number, total: number) => (width = loaded / total)
)

const textureLoader = new TextureLoader(manger)

// 巨大天空球
const sky = new Mesh(
  new SphereGeometry(1000, 60, 60),
  new MeshBasicMaterial({ map: textureLoader.load('/imgs/textures/sky.jpg') })
)
sky.geometry.scale(1, 1, -1)
scene.add(sky)

const video = document.createElement('video')
video.src = '/imgs/textures/sky.mp4'
video.loop = true
video.muted = true
video.autoplay = true
video.play()
sky.material.map = new VideoTexture(video)
sky.material.map.needsUpdate = true

const water = new Water(new CircleGeometry(300, 64), {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 'rgb(0,220,255)',
  scale: 1,
  flowDirection: new Vector2(1, 1),
  normalMap0: textureLoader.load('/imgs/textures/water/Water_1_M_Normal.jpg'),
  normalMap1: textureLoader.load('/imgs/textures/water/Water_2_M_Normal.jpg'),
})
water.rotateX(-Math.PI / 2)
scene.add(water)

const gltfLoader = new GLTFLoader(manger)
const dracoLoader = new DRACOLoader(manger)
dracoLoader.setDecoderPath('/draco')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.loadAsync('/model/island.glb').then(gltf => scene.add(gltf.scene))

const run = () => {
  loading = true
  camera.aspect = box.clientWidth / box.clientHeight
  camera.updateProjectionMatrix()
  control = new OrbitControls(camera, canvas) // 控制器
  control.enableDamping = true
  renderer = new WebGLRenderer({
    canvas,
    antialias: true, //抗锯齿
  }) // 渲染器
  renderer.setSize(box.clientWidth, box.clientHeight)
  renderer.outputEncoding = sRGBEncoding
  useResizeObserver(box, () => debouncedFn())
}
const debouncedFn = useDebounceFn(() => {
  camera.aspect = box.clientWidth / box.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(box.clientWidth, box.clientHeight)
}, 100)

const render = () => {
  renderer?.render(scene, camera)
  requestAnimationFrame(render)
}

onMounted(() => run())
</script>

<template>
  <div class="container" ref="box">
    <canvas id="webgl-canvas" ref="canvas" />
    <div v-if="loading" class="loading"></div>
  </div>
</template>
<style scoped>
.container .loading:after {
  width: calc(v-bind(width) * 100%);
}
</style>
