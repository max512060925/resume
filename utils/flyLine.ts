import {
  CatmullRomCurve3,
  Mesh,
  Vector3,
  TubeGeometry,
  MeshBasicMaterial,
  TextureLoader,
  RepeatWrapping,
  MirroredRepeatWrapping,
} from 'three'
import gsap from 'gsap'
export default class Flyline extends Mesh {
  constructor(points: [number, number, number][]) {
    super()

    this.geometry = new TubeGeometry(
      new CatmullRomCurve3(points.map(point => new Vector3(...point))),
      128,
      1,
      2,
      false
    )

    const texture = new TextureLoader().load('/textures/city/arrow.png')
    texture.repeat.setY(2)
    texture.wrapS = RepeatWrapping
    texture.wrapT = MirroredRepeatWrapping
    this.material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
    })
    this.position.set(0, 1.5, 0)

    gsap.to(texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
}
