import {
  Sprite,
  TextureLoader,
  SpriteMaterial,
  Color,
  AdditiveBlending,
  Vector2,
  Raycaster,
  Camera,
} from 'three'

export class MySprite extends Sprite {
  raycaster: Raycaster
  cacheEvent: Function
  constructor(camera: Camera) {
    super()

    const textureLoader = new TextureLoader()
    // const typeObj = {
    //   火警: "./textures/tag/fire.png",
    //   治安: "./textures/tag/jingcha.png",
    //   电力: "./textures/tag/e.png",
    // };
    const map = textureLoader.load('/icon/power.svg')
    this.material = new SpriteMaterial({
      map: map,
      color: new Color('green'),
      blending: AdditiveBlending,
      transparent: true,
      depthTest: false,
    })
    this.position.set(-1.8, 3.5, 3)
    this.raycaster = new Raycaster()
    // 事件的监听
    useEventListener(window, 'click', e => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      this.raycaster.setFromCamera(new Vector2(x, y), camera)
      const intersects = this.raycaster.intersectObject(this)
      if (intersects.length > 0 && this.cacheEvent instanceof Function) {
        this.cacheEvent(e)
      }
    })
  }
  onClick(fn) {
    if (!this.cacheEvent) {
      this.cacheEvent = fn
    }
  }
}
