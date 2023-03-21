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
  Group,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface CameraParams {
  fov: number
  near: number
  far: number
  background: string
}

interface BaseParams {
  camera?: CameraParams
  control?: boolean
}

export default class BaseWord {
  scene: Scene //场景
  camera: PerspectiveCamera //摄像机
  renderer: WebGLRenderer //渲染器
  control: OrbitControls //控制器
  clock: Clock // 时钟
  needControl: boolean
  constructor({ camera, control }: BaseParams = {}) {
    this.scene = new Scene()
    this.scene.background = new Color(camera.background)
    this.camera = new PerspectiveCamera(camera.far, 1, camera.near, camera.far)
    this.clock = new Clock()
    this.needControl = control
  }
  start(canvas: HTMLCanvasElement, box?: HTMLDivElement) {
    this.camera.aspect =
      (box || canvas).clientWidth / (box || canvas).clientHeight
    this.camera.updateProjectionMatrix()
    if (this.needControl) {
      this.control = new OrbitControls(this.camera, canvas)
      this.control.enableDamping = true
    }
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true, //抗锯齿
    })
    this.renderer.setSize(
      (box || canvas).clientWidth,
      (box || canvas).clientHeight
    )
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.render(this.scene, this.camera)

    if (box) {
      useResizeObserver(box, () =>
        useDebounceFn(() => {
          this.camera.aspect = box.clientWidth / box.clientHeight
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(box.clientWidth, box.clientHeight)
        }, 100)
      )
    }

    this.render()
  }
  render(cb?) {
    const deltaTime = this.clock.getDelta()
    // start ? helper.update(time) : controls.update()
    this.renderer.render(this.scene, this.camera)
    if (cb instanceof Function) {
      cb({ deltaTime })
    }
    requestAnimationFrame(() => this.render(cb))
  }
}
