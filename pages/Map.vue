<template lang="pug">
.w-full.h-full(ref='cesiumBox')
</template>
<script lang="ts" setup>
import { Viewer, Ion, Camera, Rectangle } from 'cesium'

useHead({
  link: [
    {
      href: '/cesium/Widgets/widgets.css',
      rel: 'stylesheet',
    },
  ],
})
const {
  public: { cesium },
} = useRuntimeConfig()

Ion.defaultAccessToken = cesium.token
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  73.66,
  3.86,
  135.05,
  53.55
) //中国四边经纬度

let cesiumBox: HTMLDivElement = $ref()
if (process.client) {
  window['CESIUM_BASE_URL'] = '/cesium'
}
onMounted(() => {
  const viewer = new Viewer(cesiumBox)
  viewer.cesiumWidget.creditContainer.remove()
})
</script>
