<template lang="pug">
.resume
  .page
    .mine
      img.z-10.absolute(
        src='~/assets/img/mine.png',
        class='rounded-[50%] w-[180px] h-[180px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      )
      .linear
        span(v-for='n in 4')
    .info.flex.flex-col
      h1 Hello~ 你好!
      h1 我是姚彦斌
      h1 一名有着8年前端开发经验的开发者
  .page.py-10.flex.flex-col(ref='skill')
    h1.text-white.text-5xl.mb-5 工作技能
    .flex-1.w-full.h-0(ref='skillRender')
      template(v-for='item in skills')
        img.h-24(
          v-show='showSkill',
          ref='skillRefs',
          :src='["vant", "taro"].includes(item) ? `/img/${item}.png` : `/icon/${item}.svg`'
        )
    ul.text-white.mt-5
      li.my-1.text-base(v-for='txt in skillsText') {{ txt }}
  .page
    h1.text-white.text-5xl.mb-5 工作经历
//- NuxtLink(to='/3D/Keqing') 刻晴
//- NuxtLink(to='/About') about
//- NuxtLink(to='/fireword') fireword
</template>
<script lang="ts" setup>
import { PerspectiveCamera, Scene, Object3D, Vector3 } from 'three'
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import gsap from 'gsap'

useHead({
  title: '姚彦斌的个人简历',
})

let skill: HTMLDivElement = $ref()
let skillRender: HTMLDivElement = $ref()
let skillRefs: HTMLImageElement[] = $ref([])
let showSkill = $ref(false)
let skillsText = [
  '熟练掌握HTML/CSS/JavaScript/Typescript',
  '熟悉常用前端工程化工具Gulp/Grunt/Webpack/Parcel/Vite，掌握模块化思想和技术实现方案',
  '熟练掌握Photoshop、 sketch等设计软件，能独立完成产品功能的交互界面设计',
  '精通Vue2和Vue3，会应用Vue生态常用工具，如vue-router/pinia/vuex',
  '精通Vue常用UI框架，如element-ui/element-plus/vant',
  '熟悉React前端框架，会应用react 16+生态常用工具，如redux/react-router',
  '熟悉React常用UI框架，如Ant Design',
  '熟练使用CSS预编译语言，掌握tailwindcss/sass/less预编译语言等',
  '熟悉计算机网络理论，掌握基于XHR(axios)/Fetch的前端应用开发经验，会熟练使用XHR(axios)/Fetch等网络请求库',
  '熟悉图形学和webgl，熟练使用threejs框架，熟练canvas相关渲染及动画操作',
  '具有小程序(uniapp,taro)、移动端混合开发、SSR、NodeJS、桌面应用(electron)开发经验',
  '会使用sequelize、mongodb操作常见数据库',
  '有良好的编码习惯，对前端技术有持续的热情，个性乐观开朗,逻辑性强，善于与团队融为一体',
]

let intersectionObserver

const skills = [
  'html',
  'css',
  'js',
  'node',
  'typescript',
  'vite',
  'webpack',
  'vue',
  'vueuse',
  'pinia',
  'nuxt',
  'react',
  'redux',
  'tailwindcss',
  'element-plus',
  'vant',
  'antd',
  'antv',
  'uniapp',
  'taro',
  'electron',
  'sequelize',
  'mongo',
  'jenkins',
]
const duration = 3
const skillsAnimation = () => {
  const renderer = new CSS3DRenderer({ element: skillRender })
  const width = skillRender.clientWidth
  const height = skillRender.clientHeight
  renderer.setSize(width, height)
  const camera = new PerspectiveCamera(40, width / height, 1, 1000)
  camera.position.z = 3000
  const scene = new Scene()
  const controls = new TrackballControls(camera, renderer.domElement)
  controls.minDistance = 500
  controls.maxDistance = 6000
  controls.noZoom = true
  const render = () => renderer.render(scene, camera)
  controls.addEventListener('change', render)

  const length = skillRefs.length
  const vector = new Vector3()
  const targets = skillRefs.map((el, i) => {
    const objectCSS = new CSS3DObject(el)
    const base = {
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: (Math.random() - 0.5) * 500,
    }
    objectCSS.position.x = base.x
    objectCSS.position.y = base.y
    objectCSS.position.z = base.z
    scene.add(objectCSS)
    const object = new Object3D()
    const phi = Math.acos(-1 + (2 * i) / length)
    const theta = Math.sqrt(length * Math.PI) * phi
    object.position.setFromSphericalCoords(height, phi, theta)
    vector.copy(object.position).multiplyScalar(2)
    object.lookAt(vector)

    return {
      objectCSS,
      object,
      base,
      positon: null,
      rotation: null,
    }
  })

  return {
    controls,
    targets,
    render,
  }
}
const transform = targets => {
  targets.forEach(item => {
    const { objectCSS, object } = item
    item.positon = gsap.fromTo(objectCSS.position, objectCSS.position, {
      x: object.position.x,
      y: object.position.y,
      z: object.position.z,
      duration: Math.random() * duration + duration,
    })
    item.rotation = gsap.fromTo(objectCSS.rotation, objectCSS.rotation, {
      x: object.rotation.x,
      y: object.rotation.y,
      z: object.rotation.z,
      duration: Math.random() * duration + duration,
    })
    item.positon.play()
  })
}
let animationId

const animate = (controls, targets, render) => {
  animationId = requestAnimationFrame(() => animate(controls, targets, render))
  transform(targets)
  controls.update()
  render()
}
const cancel = (controls, targets, render) => {
  cancelAnimationFrame(animationId)
  targets.forEach(({ objectCSS, base }) => {
    gsap.set(objectCSS.position, base)
    gsap.set(objectCSS.rotation, { x: 0, y: 0, z: 0 })
  })
  transform(targets)
  controls.update()
  render()
}
onMounted(() => {
  const { controls, targets, render } = skillsAnimation()
  intersectionObserver = useIntersectionObserver(
    skill,
    ([{ isIntersecting }]) => {
      showSkill = isIntersecting
      isIntersecting
        ? animate(controls, targets, render)
        : cancel(controls, targets, render)
    }
  )
})
onUnmounted(() => intersectionObserver?.stop())
</script>
<style lang="scss" scoped>
.linear-gradient {
  @apply bg-gradient-to-b from-sky-400 via-amber-200 to-fuchsia-500;
}
.resume {
  @apply w-screen h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-[rgb(15,12,42)];
  &::-webkit-scrollbar {
    @apply w-0;
  }
  .page {
    @apply w-screen h-screen snap-start snap-always flex flex-col items-center justify-center overflow-hidden relative;
  }
  .mine {
    @apply relative mx-auto w-[190px] h-[190px] z-10 mb-16;
    .linear {
      @apply absolute linear-gradient w-full h-full rounded-[50%] animate-spin;
      span {
        @apply absolute w-full h-full rounded-[50%] linear-gradient;
        &:nth-child(2) {
          @apply blur-[5px];
        }
        &:nth-child(3) {
          @apply blur-[10px];
        }
        &:nth-child(4) {
          @apply blur-[25px];
        }
        &:nth-child(5) {
          @apply blur-[50px];
        }
      }
    }
    &:hover {
      .linear {
        animation-play-state: paused;
      }
    }
  }
  .info {
    h1 {
      @apply text-white mx-auto my-5 text-5xl inline-block relative overflow-hidden;
      &:before {
        @apply content-[''] absolute block w-[200%] h-full bg-gradient-to-r from-amber-200 from-[49.99%] via-[rgb(15,12,42)] via-[49.99%] to-[rgb(15,12,42)] to-100% will-change-transform translate-x-[-50%] animate-[to-right-hide_1.2s_ease-in-out_both];
      }
      &:last-child:after {
        @apply content-['|'] animate-toggle opacity-0;
        animation-delay: 1.2s;
      }
    }
  }
}
</style>
