import { LineSegments, EdgesGeometry, LineBasicMaterial } from 'three'
import type { BufferGeometry } from 'three'
export default class MeseLine extends LineSegments {
  constructor(geometry: BufferGeometry) {
    super()
    this.geometry = new EdgesGeometry(geometry)
    this.material = new LineBasicMaterial({ color: 0xffffff })
  }
}
