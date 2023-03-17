<script setup lang="ts">
import THREE, {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  LoadingManager,
  TextureLoader,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const livingPics = import.meta.glob('../../public/imgs/living/*.jpg')

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let loading = $ref(false)
let width = $ref(0)
let renderer: WebGLRenderer
let control: OrbitControls
const scene = new Scene() //场景
const camera = new PerspectiveCamera(70, 1, 1, 1000) // 相机

camera.position.z = 0.1

const manger = new LoadingManager(
  () => {
    render()
    width = 1
    loading = false
  },
  (url: string, loaded: number, total: number) => (width = loaded / total)
)

const textureLoader = new TextureLoader(manger)
let materials = []
Object.keys(livingPics).forEach(img =>
  materials.push(new MeshBasicMaterial({ map: textureLoader.load(img) }))
)
// 立方体
const cube = new Mesh(new BoxGeometry(10, 10, 10), materials)
cube.geometry.scale(1, 1, -1)
scene.add(cube)

const run = () => {
  loading = true
  camera.aspect = box.clientWidth / box.clientHeight
  camera.updateProjectionMatrix()
  control = new OrbitControls(camera, canvas) // 控制器
  control.enableDamping = true
  renderer = new WebGLRenderer({ canvas }) // 渲染器
  renderer.setSize(box.clientWidth, box.clientHeight)
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

// onMounted(() => run())
</script>

<template lang="pug">
.container(ref='box')
  canvas#webgl-canvas(ref='canvas')
  .loading(v-if='loading')
</template>
<style scoped>
.container .loading:after {
  width: calc(v-bind('width') * 100%);
}
</style>
