<template lang="pug">
.w-full.h-full(ref='cesiumBox')
</template>
<script lang="ts" setup>
import Qs from 'qs'
import {
  Viewer,
  Ion,
  Camera,
  Rectangle,
  SkyBox,
  WebMapTileServiceImageryProvider,
  ImageryLayer,
} from 'cesium'

useHead({
  link: [
    {
      href: '/cesium/Widgets/widgets.css',
      rel: 'stylesheet',
    },
  ],
})
const {
  public: { cesium, tianditu },
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
  const viewer = new Viewer(cesiumBox, {
    infoBox: false,
    geocoder: false,
    homeButton: false, // home按钮
    sceneModePicker: false, //模式选择
    baseLayerPicker: false, //图层选择
    navigationHelpButton: false, //帮助按钮
    animation: false, // 动画
    timeline: false, // 时间轴
    fullscreenButton: false, //全屏按钮
    skyBox: new SkyBox({
      sources: {
        positiveX: '/textures/sky/px.jpg',
        negativeX: '/textures/sky/nx.jpg',
        positiveY: '/textures/sky/py.jpg',
        negativeY: '/textures/sky/ny.jpg',
        positiveZ: '/textures/sky/pz.jpg',
        negativeZ: '/textures/sky/nz.jpg',
      },
    }),
    imageryProvider: new WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.gov.cn/img_w/wmts?${Qs.stringify({
        SERVICE: 'WMTS',
        REQUEST: 'GetTile',
        VERSION: '1.0.0',
        LAYER: 'img',
        tileMatrixSet: 'w',
        TileMatrix: '{TileMatrix}',
        TileRow: '{TileRow}',
        TileCol: '{TileCol}',
        style: 'default',
        format: 'tiles',
        tk: tianditu.token,
      })}`,
      layer: 'tdtBasicLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
    }),
  })
  viewer.cesiumWidget.creditContainer.remove()
  const imageryLayer = new ImageryLayer(
    new WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.gov.cn/vec_w/wmts?${Qs.stringify({
        SERVICE: 'WMTS',
        REQUEST: 'GetTile',
        VERSION: '1.0.0',
        LAYER: 'vec',
        tileMatrixSet: 'w',
        TileMatrix: '{TileMatrix}',
        TileRow: '{TileRow}',
        TileCol: '{TileCol}',
        style: 'default',
        format: 'tiles',
        tk: tianditu.token,
      })}`,
      layer: 'tdtBasicLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
    }),
    {
      alpha: 0.5,
    }
  )

  viewer.imageryLayers.add(imageryLayer)
})
</script>
