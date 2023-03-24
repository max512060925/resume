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
  fov?: number
  near?: number
  far?: number
  position?: [number, number, number]
  background?: string
}

interface LightParams {
  color: string
  intensity: number
}

interface BaseParams {
  camera?: CameraParams
  control?: boolean
  ambient?: LightParams
  directional?: LightParams
}

export default class BaseWord {
  scene: Scene //场景
  camera: PerspectiveCamera //摄像机
  renderer: WebGLRenderer //渲染器
  control: OrbitControls //控制器
  ambient: AmbientLight // 环境光
  directional: DirectionalLight //平行光
  clock: Clock // 时钟
  needControl: boolean
  constructor({ camera, control, ambient, directional }: BaseParams = {}) {
    this.scene = new Scene()
    this.scene.background = new Color(camera?.background || '#334155') //'#cffafe'
    this.camera = new PerspectiveCamera(
      camera?.far || 45,
      1,
      camera?.near || 0.1,
      camera?.far || 1000
    )
    if (ambient) {
      this.ambient = new AmbientLight(
        new Color(ambient.color),
        ambient.intensity
      )
      this.scene.add(this.ambient)
    }

    if (directional) {
      this.directional = new DirectionalLight(
        new Color(directional.color),
        directional.intensity
      )
      this.scene.add(this.directional)
    }
    camera?.position
      ? this.camera.position.set(...camera.position)
      : this.camera.position.set(0, 10, 10)

    this.clock = new Clock()
    this.needControl = control
    this.scene.add(new AxesHelper(5))
    this.scene.add(this.camera)
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
      alpha: true,
      antialias: true, //抗锯齿
    })
    this.renderer.setSize(
      (box || canvas).clientWidth,
      (box || canvas).clientHeight
    )
    // this.renderer.physicallyCorrectLights = true
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
  }
  animate(cb) {
    if (cb instanceof Function) {
      cb()
    }
    if (this.needControl) {
      this.control.update()
    }
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate(cb))
  }
}
