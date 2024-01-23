<template lang="pug">
.resume(ref='swiperBox')
  .swiper-wrapper
    .swiper-slide
      .mine
        img.z-10.absolute(src='~/assets/img/mine.png', class='w-65% h-65% left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')
        .linear
      .info.flex.flex-col
        h1 Hello~ 你好!
        h1 我是姚彦斌
        h1 从事前端开发已有9年
    .swiper-slide.py-50px(ref='skill')
      h1.text-white.text-5xl.mb-10 个人技能
      .flex.flex-1.h-0.px-20.items-center.w-full(class='pl-10%')
        ul.text-white.flex.flex-col.flex-1
          li.text-base.whitespace-wrap(v-for='txt in skillsText') {{ txt }}
        .skill-animate.flex-1.w-full.h-full(ref='skillRender')
          template(v-for='item in skills')
            img.h-8vw(v-show='showSkill', ref='skillRefs', :src='getImgSrc(item)')
    .swiper-slide.py-20
      h1.text-white.text-5xl.mb-5 工作经历
      .timeline
        .item(v-for='({ time, company, position, work, link }, i) in timeline')
          time.text-right.whitespace-nowrap.border-r-2.border-solid.grow-0.shrink-0.w-50.-ml-50.pr-10.mr-20(class='text-white/[0.6] border-white/[0.7]', :class='i === 0 ? ["pt-0", "mt-30px"] : ["pt-30px"]') {{ time }}
          i.border-2.border-solid.border-white.mt-30px.mr-10.-ml-10(class='w-2.5 h-2.5 rounded-1/2 -translate-x-1/2 bg-[var(--bg-color)]')
          MyCard.flex-1.px-10.mb-30px.py-6(class='hover:bg-#1e293b80 group/card')
            h3.text-xl.leading-relaxed.inline-block.line-effect(class='!group-hover/card:bg-[length:100%_2px] !group-hover/card:bg-left-bottom') {{ company }} #[span.ml-2.text-base(class='text-white/[0.7]') ({{ position }})]
            .grid(class='grid-rows-[0fr] group-hover/card:grid-rows-[1fr]')
              ul.overflow-hidden
                li.list-none(v-for='item in work', class='first:mt-3')
                  p.inline-flex.items-center.leading-relaxed.line-effect(class='!group-hover/card:bg-[length:100%_2px] !group-hover/card:bg-left-bottom') #[IconProject.mr-2] {{ item }}
                .flex.justify-end
                  a.leading-relaxed.line-effect(:href='link', target='_blank') 公司官网
    .swiper-slide.py-20.relative
      h1.text-white.text-5xl.mb-10 联系方式
      .flex.items-center.justify-between.mx-auto(class='w-1/3')
        .flex.items-center.justify-center.text-transparent.bg-clip-text(class='bg-image-[linear-gradient(to_right,#38bdf8,#fde68a,#d946ef)]')
          IconPhone.text-3xl.text-white.mr-2
          | 13916533023
        .relative.flex.items-center.justify-center.group
          IconWeChat.text-3xl.text-white
          img.absolute.w-50.-translate-y-full.h-0.max-w-unset.transition-height(src='~/assets/img/we-chat.jpg', alt='we-chat', ref='weChatImg', class='-top-2.5 -translate-x-1/2 left-1/2 group-hover:h-50')
        .flex.items-center.justify-center.text-transparent.bg-clip-text(class='bg-image-[linear-gradient(to_right,#38bdf8,#fde68a,#d946ef)]')
          IconQq.text-3xl.text-white.mr-2
          | 512060925
        a.flex.items-center.justify-center.text-transparent.bg-clip-text(class='bg-image-[linear-gradient(to_right,#38bdf8,#fde68a,#d946ef)]', href='https://github.com/max512060925', target='_blank')
          IconGithub.text-3xl.text-white.mr-2
          | github.com/max512060925
      footer.text-white.absolute.bottom-10(class='text-(2xl center)') 谢谢观看
        p.text-xl 期待与您共事
  .swiper-pagination
</template>

<script lang="ts" setup>
import { skillsText } from '~/utils'
import Swiper from 'swiper'
import { Pagination, Mousewheel } from 'swiper/modules'
import 'swiper/css/pagination'
import { PerspectiveCamera, Scene, Object3D, Vector3, Group } from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import gsap from 'gsap'

useHead({
  title: '姚彦斌的个人简历'
})

let swiperBox: HTMLDivElement = $ref()
let skill: HTMLDivElement = $ref()
let skillRender: HTMLDivElement = $ref()
let skillRefs: HTMLImageElement[] = $ref([])
let showSkill = $ref(false)

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
  'uno'
]

const timeline = [
  {
    time: '2019.02-至今',
    company: '上海容智信息技术有限公司',
    position: '前端经理',
    work: [
      '负责公司前端项目从0-1的搭建',
      '负责iBotX客户端应用程序开发、维护、升级',
      '机器人管理后台开发、维护、升级',
      '超级自动化平台开发、维护、升级',
      '内部基于iframe postmessage微前端构建',
      '内部vue3组件构建'
    ],
    link: 'https://infodator.com/'
  },
  {
    time: '2017.10-2019.02',
    company: '上海雳嬴商务咨询',
    position: '前端开发',
    work: ['主要负责外汇金融SVSFX客户管理后台(CRM)开发、维护、升级', 'PC端、移动端官网开发、维护', '使用uniapp开发活动页H5页面开发、aes加密对接'],
    link: 'https://baike.baidu.com/item/SVSFX/7237974/'
  },
  {
    time: '2016.06-2017.09',
    company: '上海傲祺商务咨询有限公司',
    position: '前端开发',
    work: ['负责开发各类广告微信H5页面开发', '各类微信朋友圈广告开发', '微信公众号管理后台开发', '微信小程序开发'],
    link: 'https://www.oookini.com/'
  },
  {
    time: '2015.03-2016.05',
    company: '上海智用文化传播有限公司',
    position: '前端开发',
    work: ['负责怪猫游戏官网开发、维护', '活动页面的开发'],
    link: 'https://gm88.com/'
  },
  {
    time: '2013.09-2015.02',
    company: '上海邮通科技有限公司',
    position: '前端开发',
    work: ['负责官网界面开发、维护', '活动页面的开发'],
    link: 'https://www.tiancity.com/'
  }
]

const duration = 1
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
  const vector = new Vector3(0, 0, 0)
  const group = new Group()
  const targets = skillRefs.map((el, i) => {
    const objectCSS = new CSS3DObject(el)
    const base = {
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: (Math.random() - 0.5) * 1000
    }
    objectCSS.position.x = base.x
    objectCSS.position.y = base.y
    objectCSS.position.z = base.z
    group.add(objectCSS)
    const object = new Object3D()
    const phi = Math.acos(-1 + (2 * i) / length)
    const theta = Math.sqrt(length * Math.PI) * phi
    object.position.setFromSphericalCoords(width * 0.8, phi, theta)
    object.lookAt(vector)
    return {
      objectCSS,
      object,
      base,
      positon: null,
      rotation: null
    }
  })
  scene.add(group)
  return {
    controls,
    targets,
    render,
    group
  }
}
const transform = targets => {
  targets.forEach(item => {
    const { objectCSS, object } = item
    item.positon = gsap.fromTo(objectCSS.position, objectCSS.position, {
      x: object.position.x,
      y: object.position.y,
      z: object.position.z,
      duration: Math.random() * duration + duration
    })
    item.rotation = gsap.fromTo(objectCSS.rotation, objectCSS.rotation, {
      x: object.rotation.x,
      y: object.rotation.y,
      z: (object.rotation.z += 0.02),
      duration: Math.random() * duration + duration
    })
    item.positon.play()
  })
}
let animationId

const animate = (controls, targets, render, group) => {
  animationId = requestAnimationFrame(() => animate(controls, targets, render, group))
  group.rotation.y += 0.005
  group.rotation.z += 0.001
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
const assets: Record<string, string> = import.meta.glob(['~/assets/icon/*', '~/assets/img/*'], {
  eager: true,
  import: 'default'
})

const getImgSrc = item => assets[['vant', 'taro'].includes(item) ? `/assets/img/${item}.png` : `/assets/icon/${item}.svg`]

onMounted(() => {
  new Swiper(swiperBox, {
    modules: [Mousewheel, Pagination],
    direction: 'vertical',
    allowTouchMove: false,
    mousewheel: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  })
  const { controls, targets, render, group } = skillsAnimation()
  intersectionObserver = useIntersectionObserver(skill, ([{ isIntersecting }]) => {
    showSkill = isIntersecting
    isIntersecting ? animate(controls, targets, render, group) : cancel(controls, targets, render)
  })
})

onUnmounted(() => intersectionObserver?.stop())
</script>
<style lang="scss" scoped>
@property --spin {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@mixin linear-gradient() {
  background-image: linear-gradient(var(--spin), #38bdf8, #fde68a, #d946ef);
  animation: image-spin 1.2s linear infinite;
}
@keyframes image-spin {
  0% {
    --spin: 0deg;
  }
  100% {
    --spin: 360deg;
  }
}

.resume {
  --bg-color: rgb(15, 12, 42);

  @apply w-screen h-screen scroll-smooth bg-[var(--bg-color)] overflow-hidden;
  .swiper-slide {
    @apply w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative;
  }
  .mine {
    @apply relative mx-auto w-250px h-250px z-10 mb-16;
    img {
      clip-path: path('M81.25 29.92c-19.134-38.559-81.243-27.516-81.243 22.14 0 49.223 67.052 74.059 81.243 103.668 14.192-29.609 81.25-54.444 81.25-103.668 0-49.61-62.089-60.748-81.25-22.141z');
    }
    .linear {
      clip-path: polygon(0% 0%, 0% 100%, 40px 100%, 40px 40px, calc(100% - 40px) 40px, calc(100% - 40px) calc(100% - 40px), 40px calc(100% - 40px), 30px 100%, 100% 100%, 100% 0%);
      @apply absolute w-full h-full before:(content-[''] z-2 blur-20 bg-image-inherit absolute w-full h-full);
      &:after {
        @apply content-[''] blur-5 bg-image-inherit z-2 absolute w-80% h-80% left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
        @include linear-gradient;
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
        @apply content-[''] absolute block w-200% h-full bg-gradient-to-r from-[#fde68a_49.99%] via-[rgb(15,12,42)_49.99%] to-[rgb(15,12,42)_100%] will-change-transform -translate-x-1/2 animate-[to-right-hide_1.2s_ease-in-out_both];
      }
      &:last-child:after {
        @apply content-['|'] opacity-0 animate-[opacity_0.9s_infinite];
        animation-delay: 1.2s;
      }
    }
  }

  .timeline {
    @apply flex flex-1 flex-col max-w-1152px mx-auto w-full px-12 justify-center;
    .item {
      @apply flex ml-300px;
    }
  }

  .swiper-pagination {
    @apply left-[32px] right-[auto];
    ::v-deep(.swiper-pagination-bullet) {
      @apply bg-white opacity-20;
    }
    ::v-deep(.swiper-pagination-bullet-active) {
      @apply bg-transparent border-2 border-solid border-white opacity-100;
    }
  }
  .line-effect {
    @apply bg-gradient-to-r from-purple-500 to-pink-500 bg-right-bottom bg-[length:0_2px] bg-no-repeat hover:bg-[length:100%_2px] hover:bg-left-bottom;
    transition: background-size 0.7s;
  }
  .card {
    .grid {
      transition: grid-template-rows 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    }
  }
}
</style>
