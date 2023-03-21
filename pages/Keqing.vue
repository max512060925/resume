<template lang="pug">
.container(ref='box')
  Loading(:percentage='percentage', :load-text='loadText', v-if='loading')
  .btn-box(v-else)
    SvgIcon(:name='start ? "pause" : "play"', @click='play')
  canvas#webgl-canvas(ref='canvas')
</template>

<script lang="ts" setup>
import {
  LoadingManager,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AxesHelper,
  Audio,
  AudioListener,
  AudioLoader,
  AmbientLight,
  AnimationClip,
  Color,
  DirectionalLight,
  sRGBEncoding,
  Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js'
import type { MMDLoaderAnimationObject } from 'three/examples/jsm/loaders/MMDLoader.js'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js'

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let start = $ref(false)
let loading = $ref(true)
let percentage = $ref(0)
let loadText = $ref('')
const { Ammo } = window
const manager = new LoadingManager() //加载管理器
const scene = new Scene() //场景
const camera = new PerspectiveCamera(45, 1, 0.1, 100) //摄像机
const clock = new Clock() // 设置时钟

const helper = new MMDAnimationHelper()
const mmdLoader = new MMDLoader(manager) //mmd加载器
const audioLoader = new AudioLoader(manager) //音频加载器
const listener = new AudioListener()
// const ambientLight = new AmbientLight('#fff') // 光
const directionalLight = new DirectionalLight(0xffffff, 1) //平行光

const scale = 0.3
scene.add(directionalLight)

let renderer: WebGLRenderer, //渲染器
  controls: OrbitControls, //控制器
  audio: Audio //音频
// scene.add(new AxesHelper(5)) // 辅助线
camera.add(listener)
scene.add(camera)
scene.add(directionalLight)

// const sky
const loadModelAndAnimation = (): Promise<MMDLoaderAnimationObject> =>
  new Promise(resolve =>
    mmdLoader.loadWithAnimation(
      '/model/keqing/keqing.pmx',
      '/model/keqing/motion.vmd',
      obj => resolve(obj)
    )
  )

const loadCameraMotion = (): Promise<AnimationClip> =>
  new Promise(resolve =>
    mmdLoader.loadAnimation('/model/keqing/camera.vmd', camera, animation =>
      resolve(animation as AnimationClip)
    )
  )

const loadModel = async () => {
  const [{ mesh, animation }, cameraAnimation, buffer] = await Promise.all([
    loadModelAndAnimation(),
    loadCameraMotion(),
    audioLoader.loadAsync(
      // 'https://m701.music.126.net/20230317220547/6bef08287eeb3c127b759f3abd6249e0/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/14096631885/0cf4/3be2/b803/196c17df9f34ba18122c2d602890ae06.m4a'
      '/model/keqing/summertime.wav'
    ),
  ])

  helper.add(mesh, {
    animation,
    physics: true,
    gravity: 9.8,
  })
  console.log(cameraAnimation)
  helper.add(camera, {
    animation: cameraAnimation,
    physics: true,
    gravity: 9.8,
  })
  audio = new Audio(listener)
  helper.add(audio.setBuffer(buffer))
  mesh.geometry.computeBoundingBox()
  scene.add(mesh)
  const centerY =
    (mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y) / 2
  camera.zoom = 0.75
  camera.position.set(mesh.position.x, centerY, 20)
  controls.target = new Vector3(mesh.position.x, centerY, mesh.position.z)
  camera.lookAt(new Vector3(mesh.position.x, centerY, mesh.position.z))
}
const render = () => {
  const time = clock.getDelta()
  start ? helper.update(time) : controls.update()

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

const resizeDebounced = useDebounceFn(() => {
  camera.aspect = box.clientWidth / box.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(box.clientWidth, box.clientHeight)
}, 100)

const play = () => {
  start = !start
  start ? audio.play() : audio.pause()
}

onMounted(async () => {
  await Ammo()
  controls = new OrbitControls(camera, canvas) // 控制器
  controls.enableDamping = true
  await loadModel()
  scene.background = new Color('#cffafe')
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
  renderer = new WebGLRenderer({
    canvas,
    antialias: true, //抗锯齿
  }) //渲染器
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = sRGBEncoding

  renderer.render(scene, camera)
  render()
  useResizeObserver(box, resizeDebounced)
  loading = false
})

manager.onProgress = (url, loaded, total) => {
  console.log(url)
  percentage = loaded / total
}
</script>
<style lang="scss" scoped>
.btn-box {
  position: absolute;
  width: 90%;
  bottom: 20px;
  transform: translate(-50%);
  left: 50%;
  .svg-icon {
    font-size: 5vw;
    color: #999;
    cursor: pointer;
  }
}
</style>
