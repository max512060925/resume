<template lang="pug">
.w-full.h-full
  canvas.w-full.h-full(ref='canvas')
</template>
<script lang="ts" setup>
import { Mesh, Shape, ShapeGeometry, MeshBasicMaterial } from 'three'
import BaseWord from '@/utils/baseScene'
let canvas: HTMLCanvasElement = $ref()
let box: HTMLDivElement = $ref()
let floor = $ref(0)

let floors = shallowReactive([])
let currentFloor = $computed(() => floors[floor])
const word = new BaseWord({
  control: true,
  camera: {
    fov: 45,
    near: 0.1,
    far: 100,
    position: [50, 50, 50],
  },
  directional: {
    color: '#fff',
    intensity: 0.7,
  },
})
const getRoomData = async () => {
  const res: string = await $fetch(
    'https://vr4cdn.5i5j.com/WoAiWoJia-8330701_abb8a74d-cbd1-474a-9339-b9904b2db634/ViewData.txt'
  )
  const data = JSON.parse(res)
  console.log(data)
  floors = data.Floors
  word.start(canvas, box)
  const shape = new Shape()

  currentFloor.Rooms[0].MarkPointList.forEach(({ Position }, i) =>
    i === 0
      ? shape.moveTo(Position.x, Position.z)
      : shape.lineTo(Position.x, Position.z)
  )

  const cube = new Mesh(
    new ShapeGeometry(shape),
    new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
    })
  )
  // cube.rotation.set(currentFloor.Rooms[0].Rotation)
  cube.geometry.scale(1, 1, -1)
  word.scene.add(cube)
  console.log(word)
  word.animate()
}
getRoomData()

const createRooms = () => {
  // currentFloor.rooms.forEach(room =>)
}
</script>
