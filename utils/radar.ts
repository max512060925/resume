import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  DoubleSide,
  AdditiveBlending,
} from 'three'
import type { ColorRepresentation } from 'three'
import gsap from 'gsap'

const vertexShader = `
varying vec3 vPosition;
varying vec2 vUv;
void main(){
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;
    vPosition = position;
    vUv = uv;
}`

const fragmentShader = `
#include <common>
varying vec3 vPosition;
varying vec2 vUv;
uniform vec3 color;
uniform float time;
mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}
void main(){
  vec2 newUv=rotate2d(time*PI*2.)*(vUv-.5);
  newUv+=.5;
  float alpha=1.-step(.5,distance(newUv,vec2(.5)));
  float angle=atan(newUv.x-.5,newUv.y-.5);
  float strength=(angle+PI)/(PI*2.);
  gl_FragColor=vec4(color,alpha*strength);
}
`
export class Radar extends Mesh {
  constructor(
    radius: number = 2,
    position: [number, number, number] = [0, 0, 0],
    color: ColorRepresentation = 0xff0000
  ) {
    super()
    this.geometry = new PlaneGeometry(radius, radius)
    this.material = new ShaderMaterial({
      uniforms: {
        color: {
          value: new Color(color),
        },
        time: {
          value: 0,
        },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    this.position.set(...position)
    this.rotation.x = -Math.PI / 2

    gsap.to((this.material as ShaderMaterial).uniforms.time, {
      value: 1,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }

  // remove() {
  //   this.mesh.remove()
  //   this.mesh.removeFromParent()
  //   this.mesh.geometry.dispose()
  //   this.mesh.material.dispose()
  // }
}
