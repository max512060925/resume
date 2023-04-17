import {
  Points,
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Color,
  DoubleSide,
  AdditiveBlending,
} from 'three'
import type { ColorRepresentation } from 'three'
import gsap from 'gsap'

const vertexShader = `
attribute float size; 
varying float vSize;
uniform float time;
uniform float length;
void main(){
  vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
  gl_Position = projectionMatrix *  viewPosition;
  vSize = size;
  vSize = vSize - time;
  if(vSize<=0.0){
    vSize = vSize + length; 
  }
  vSize = (vSize-700.0)*0.3;
  gl_PointSize = -vSize/viewPosition.z * 50.;
}
`
const fragmentShader = `
varying float vSize;
uniform vec3 color;
void main(){
  float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
  float strength = 1.0 - (distanceToCenter*2.0);
  gl_FragColor = vec4(1,0,0,strength);
  if(vSize<=0.0){
    gl_FragColor = vec4(1,0,0,0);
  }else{
    gl_FragColor = vec4(color,strength);
  }
}
`

export default class FlyLineShader extends Points {
  constructor(
    line: [number, number, number][],
    color: ColorRepresentation = 'red'
  ) {
    super()
    const lineCurve = new CatmullRomCurve3(
      line.map(point => new Vector3(...point))
    )
    const points = lineCurve.getPoints(1000)
    this.geometry = new BufferGeometry().setFromPoints(points)
    const size = new Float32Array(points.length)
    for (let i = 0; i < size.length; i++) {
      size[i] = i
    }
    this.geometry.setAttribute('size', new BufferAttribute(size, 1))
    // 设置着色器材质
    this.material = new ShaderMaterial({
      uniforms: {
        time: {
          value: 0,
        },
        length: {
          value: points.length,
        },
        color: {
          value: new Color(color),
        },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    // 设置动画
    gsap.to((this.material as ShaderMaterial).uniforms.time, {
      value: 200,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
  // remove(scene) {
  //   // 移除物体
  //   this.mesh.removeFromParent()
  //   // 移除材质
  //   this.material.dispose()
  //   // 移除几何体
  //   this.geometry.dispose()
  // }
}
