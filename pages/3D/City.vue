<template lang="pug">
.w-full.h-full(ref='box')
  canvas.w-full.h-full(ref='canvas')
</template>
<script lang="ts" setup>
import {
  Vector3,
  Mesh,
  MeshBasicMaterial,
  Color,
  Vector2,
  CubeTextureLoader,
  CubeRefractionMapping,
} from 'three'
import Flyline from '@/utils/flyLine'
import FlyLineShader from '@/utils/flyLineShader'
import MeshLine from '@/utils/meshLine'
import LinghtWall from '@/utils/linghtWall'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'

let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
const word = new BaseWord({
  control: true,
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [50, 50, 50],
  },
  directional: {
    color: '#fff',
    intensity: 0.7,
  },
})

const spreadFragmentEffect = `
// 半径
float radius = distance(vPosition.xy,center);
//  扩散范围的函数
float spreadIndex = -pow(radius-spreadDuration, 2.)+width;
if(spreadIndex>0.0){
  gl_FragColor = mix(gl_FragColor,vec4(spreadColor,1),spreadIndex/width);
}
`
const lineFragmentEffect = `
float lineIndex = -pow(lineDuration-vPosition.x+vPosition.y, 2.)+width ;
if(lineIndex>0.0){
  gl_FragColor = mix(gl_FragColor,vec4(lineColor,1),lineIndex/width);
}
`
const goTopFragmentEffect = `
float goTopIndex = -pow(vPosition.z-lineDuration, 2.)+(width*50.0);
if(goTopIndex>0.0){
  gl_FragColor = mix(gl_FragColor,vec4(goTopColor,1),goTopIndex/(width*50.0));
}
`

onMounted(() => {
  word.start(canvas, box)
  const envMap = new CubeTextureLoader()
    .setPath('/textures/environment/sky')
    .load(['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg'])
  envMap.mapping = CubeRefractionMapping
  word.scene.background = envMap
  word.scene.environment = envMap
  new FBXLoader().load('/models/city.fbx', object => {
    object.traverse((item: Mesh) => {
      if (item.isMesh) {
        item.geometry.computeBoundingBox()
        const { min, max } = item.geometry.boundingBox
        const diffH = max.y - min.y
        item.material = new MeshBasicMaterial({
          color: new Color('#22c55e'),
          transparent: true,
        })
        item.material.onBeforeCompile = shader => {
          // console.log(shader.vertexShader)
          // console.log(shader.fragmentShader)
          shader.uniforms.topColor = {
            value: new Color('#fef08a'),
          }
          shader.uniforms.diffHeight = {
            value: diffH,
          }
          // 设置扩散的中心点
          shader.uniforms.center = { value: new Vector2(0, 0) }
          //   扩散的时间
          shader.uniforms.spreadDuration = { value: 0 }
          //   设置条带的宽度
          shader.uniforms.width = { value: 40 }
          shader.uniforms.spreadColor = { value: new Color('#ef4444') }
          //
          shader.uniforms.lineDuration = { value: -700 }
          shader.uniforms.lineColor = { value: new Color('#c026d3') }
          shader.uniforms.goTopColor = { value: new Color('#bbf7d0') }
          shader.vertexShader = `
            varying vec3 vPosition;
            ${shader.vertexShader}
          `
          shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_vertex>',
            `
            #include <fog_vertex>
            vPosition = position;
            `
          )
          shader.fragmentShader = `
          varying vec3 vPosition;
          uniform float diffHeight;
          uniform vec3 topColor;
          uniform vec2 center;
          uniform float spreadDuration;
          uniform float width;
          uniform vec3 spreadColor;
          uniform float lineDuration;
          uniform vec3 lineColor;
          uniform vec3 goTopColor;
          ${shader.fragmentShader}
          `
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            // 混合颜色
            gl_FragColor = vec4(mix(gl_FragColor.xyz,topColor,(vPosition.z+diffHeight/2.)/diffHeight),1);
            ${spreadFragmentEffect}
            ${lineFragmentEffect}
            ${goTopFragmentEffect}
          `
          )
          gsap.to(shader.uniforms.spreadDuration, {
            value: 1000,
            duration: 3,
            ease: 'none',
            repeat: -1,
          })
          gsap.to(shader.uniforms.lineDuration, {
            value: 1000,
            duration: 5,
            ease: 'none',
            repeat: -1,
          })
        }
      }
    })
    const scale = 0.05
    object.scale.copy(new Vector3(scale, scale, scale))
    word.scene.add(object)
    const build = word.scene.getObjectByName('Layerbuildings') as Mesh
    const line = new MeshLine(build.geometry)
    line.rotateX(-Math.PI / 2)
    const lineScale = scale * 1.005
    line.scale.copy(new Vector3(lineScale, lineScale, lineScale))
    line.position.y = build.position.y * lineScale
    word.scene.add(line)

    word.scene.add(
      new Flyline([
        [0, 0, -20],
        [0, 8, -15],
        [0, 10, -10],
        [0, 8, -5],
        [0, 0, 0],
      ])
    )
    word.scene.add(
      new FlyLineShader([
        [0, 0, 20],
        [0, 8, 15],
        [0, 10, 10],
        [0, 8, 5],
        [0, 0, 0],
      ])
    )
    word.scene.add(new LinghtWall({ radius: 10, height: 5 }))
    word.scene.add(new Radar(6, [4, 2, -7]))

    const sprite = new MySprite(word.camera)
    word.scene.add(sprite)
    sprite.onClick(e => {
      console.log(666)
      console.log(e)
    })
    // scene.add(lightRadar.mesh);
    word.animate()
  })
})
</script>
