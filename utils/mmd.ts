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
import type { SkinnedMesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js'
import type { MMDLoaderAnimationObject } from 'three/examples/jsm/loaders/MMDLoader.js'
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js'

interface MMDParams {
  pmx: string
  vmd: string | string[]
}

export default class MMD {
  manager: LoadingManager //加载管理器
  helper: MMDAnimationHelper
  mmdLoader: MMDLoader //mmd加载器
  audio: Audio //音频
  audioLoader: AudioLoader //音频加载器
  constructor() {
    this.manager = new LoadingManager()
    this.helper = new MMDAnimationHelper()
    this.mmdLoader = new MMDLoader(this.manager)
    this.audioLoader = new AudioLoader(this.manager)
  }
  loadModelAndAnimation({ pmx, vmd }: MMDParams): Promise<SkinnedMesh> {
    return new Promise(resolve =>
      this.mmdLoader.loadWithAnimation(pmx, vmd, ({ mesh, animation }) => {
        this.helper.add(mesh, {
          animation,
          physics: true,
          gravity: 9.8,
        })
        resolve(mesh)
      })
    )
  }
  loadCameraMotion(vmd: string, camera): Promise<void> {
    return new Promise(resolve =>
      this.mmdLoader.loadAnimation(vmd, camera, (animation: AnimationClip) => {
        this.helper.add(camera, {
          animation,
          physics: true,
          gravity: 9.8,
        })
        resolve()
      })
    )
  }
  async loadAudio(src, camera) {
    const listener = new AudioListener()
    const buffer = await this.audioLoader.loadAsync(src)
    this.audio = new Audio(listener)
    this.helper.add(this.audio.setBuffer(buffer))
    camera.add(listener)
  }
}
