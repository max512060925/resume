<template lang="pug">
.w-full.h-full(ref='box')
  canvas.w-full.h-full(ref='canvas')
</template>
<script lang="ts" setup>
import { Vector3, Mesh, MeshBasicMaterial, Color, Vector2 } from 'three'
import BaseWord from '@/utils/baseScene'
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

const loader = new FBXLoader()

onMounted(() => {
  word.start(canvas, box)
  loader.load('/models/city.fbx', object => {
    object.traverse((item: Mesh) => {
      if (item.isMesh) {
        item.geometry.computeBoundingBox()
        // item.material
        const { min, max } = item.geometry.boundingBox
        const diffH = max.y - min.y
        item.material = new MeshBasicMaterial({
          color: new Color('#22c55e'),
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
          shader.uniforms.duration = { value: -2 * 100 }
          //   设置条带的宽度
          shader.uniforms.width = { value: 40 }
          shader.uniforms.spreadColor = { value: new Color('#ef4444') }
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
          uniform float duration;
          uniform float width;
          uniform vec3 spreadColor;
          ${shader.fragmentShader}
          `
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            // 混合颜色
            gl_FragColor = vec4(mix(gl_FragColor.xyz,topColor,(vPosition.z+diffHeight/2.)/diffHeight),1);
            // 扩散效果
            // 半径
            float radius = distance(vPosition.xy,center);
            //  扩散范围的函数
            float spreadIndex = -pow(radius-duration, 2.)+width;
            if(spreadIndex>0.0){
              gl_FragColor = mix(gl_FragColor,vec4(spreadColor,1),spreadIndex/width);
            }
          `
          )
          gsap.to(shader.uniforms.duration, {
            value: 150,
            duration: 2,
            ease: 'none',
            repeat: -1,
          })
        }
      }
    })
    const scale = 0.05
    object.scale.copy(new Vector3(scale, scale, scale))
    word.scene.add(object)
    word.animate()
  })
})
</script>
