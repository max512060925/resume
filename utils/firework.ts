import {
  Color,
  BufferGeometry,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  BufferAttribute,
  Clock,
  AudioListener,
  Audio,
  AudioLoader,
} from 'three'
import pointVertex from '@/shaders/point/vertex.glsl'
import pointFragment from '@/shaders/point/fragment.glsl'
import fireVertex from '@/shaders/fire/vertex.glsl'
import fireFragment from '@/shaders/fire/fragment.glsl'

export default class Firework {
  color: Color
  point: Points //初始圆点
  fire: Points //爆炸效果
  clock: Clock
  cacheSize: number
  sound: Audio
  boomSound: Audio

  isBoomed: boolean
  constructor(color: string, to: [number, number, number], from = [0, 0, 0]) {
    this.color = new Color(color)
    this.point = new Points(
      new BufferGeometry(),
      new ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        uniforms: {
          time: {
            value: 0,
          },
          size: {
            value: 0,
          },
          color: { value: this.color },
        },
      })
    )
    this.point.geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(from), 3)
    )
    this.point.geometry.setAttribute(
      'diff',
      new BufferAttribute(
        new Float32Array([to[0] - from[0], to[1] - from[1], to[2] - from[2]]),
        3
      )
    )
    const fireCounts = 250 + Math.round(Math.random() * 250)
    const firePositions = new Float32Array(fireCounts * 3)
    const fireScales = new Float32Array(fireCounts)
    const directions = new Float32Array(fireCounts * 3)
    for (let i = 0; i < fireCounts; i++) {
      firePositions[i * 3] = to[0]
      firePositions[i * 3 + 1] = to[1]
      firePositions[i * 3 + 2] = to[2]
      fireScales[i] = Math.random()

      const horizontalAngle = 2 * Math.PI * Math.random()
      const verticalAngle = 2 * Math.PI * Math.random()
      const radius = Math.random()

      directions[i * 3] =
        radius * Math.sin(horizontalAngle) + radius * Math.sin(verticalAngle)
      directions[i * 3 + 1] =
        radius * Math.cos(horizontalAngle) + radius * Math.cos(verticalAngle)
      directions[i * 3 + 2] =
        radius * Math.sin(horizontalAngle) + radius * Math.cos(verticalAngle)
    }

    this.fire = new Points(
      new BufferGeometry(),
      new ShaderMaterial({
        vertexShader: fireVertex,
        fragmentShader: fireFragment,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        uniforms: {
          time: {
            value: 0,
          },
          size: {
            value: 0,
          },
          color: { value: this.color },
        },
      })
    )
    this.fire.geometry.setAttribute(
      'position',
      new BufferAttribute(firePositions, 3)
    )
    this.fire.geometry.setAttribute('scale', new BufferAttribute(fireScales, 1))
    this.fire.geometry.setAttribute(
      'random',
      new BufferAttribute(directions, 3)
    )
    this.clock = new Clock()
    const audioLoader = new AudioLoader()

    this.sound = new Audio(new AudioListener())
    this.boomSound = new Audio(new AudioListener())

    audioLoader.load('/audio/firework.mp3', buffer => {
      this.sound.setBuffer(buffer)
      this.sound.setVolume(1)
      this.sound.play()
    })

    audioLoader.load(
      `/audio/boom${Math.floor(Math.random() * 4) + 1}.ogg`,
      buffer => {
        this.boomSound.setBuffer(buffer)
        this.boomSound.setVolume(1)
        this.isBoomed = false
      }
    )
  }
  dispose(obj: Points) {
    obj.geometry.dispose()
    ;(obj.material as ShaderMaterial).dispose()
    obj.clear()
  }

  update(cb) {
    const elapsedTime = this.clock.getElapsedTime()
    const { uniforms: pointUniforms } = this.point.material as ShaderMaterial
    const { uniforms: fireUniforms } = this.fire.material as ShaderMaterial

    if (elapsedTime < 1) {
      pointUniforms.time.value = elapsedTime
      pointUniforms.size.value = 10 + 10 * elapsedTime
      this.cacheSize = pointUniforms.size.value
    } else if (elapsedTime >= 1) {
      const time = elapsedTime - 1

      fireUniforms.size.value = this.cacheSize
      fireUniforms.time.value = time
      pointUniforms.size.value = 0
      this.dispose(this.point)
      if (!this.boomSound.isPlaying && !this.isBoomed) {
        this.boomSound.play()
        this.isBoomed = true
      }
      if (elapsedTime > 5) {
        this.cacheSize = 0
        fireUniforms.time.value = elapsedTime
        fireUniforms.size.value = 0
        this.dispose(this.fire)
      }
    }
  }
}
