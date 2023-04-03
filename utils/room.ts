import { Mesh, Shape } from 'three'
import type { BufferGeometry, Material } from 'three'

export default class Room extends Mesh {
  room: { MarkPointList: any[]; Position: { x: number; y: number; z: number } }
  constructor(room) {
    super()
    this.room = room
    // this.geometry =
  }
}
