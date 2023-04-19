import {
  Mesh,
  CylinderGeometry,
  ShaderMaterial,
  DoubleSide,
  AdditiveBlending,
} from 'three'
import gsap from 'gsap'
const vertexShader = `
varying vec3 vPosition;
void main(){
  vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
  gl_Position = projectionMatrix * viewPosition;
  vPosition = position;
}`
const fragmentShader = `
varying vec3 vPosition;
uniform float height;
void main(){
  float gradMix = (vPosition.y+height/2.0)/height;
  gl_FragColor = vec4(1,1,0,1.0-gradMix);
}
`

export default class LightWall extends Mesh {
  constructor({
    radius = 5,
    height = 2,
  }: {
    radius?: number
    height?: number
  }) {
    super()
    this.geometry = new CylinderGeometry(radius, radius, height, 32, 1, true)
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    this.geometry.computeBoundingBox()
    const { min, max } = this.geometry.boundingBox
    this.position.y = 3
    ;(this.material as ShaderMaterial).uniforms.height = {
      value: max.y - min.y,
    }
    this.scale.x = 0.5
    this.scale.z = 0.5
    gsap.to(this.scale, {
      x: 1.5,
      z: 1.5,
      direction: 10,
      repeat: -1,
      yoyo: true,
    })
  }
}
