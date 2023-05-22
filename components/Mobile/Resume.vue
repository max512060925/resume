<template lang="pug">
.mobile-resume.w-screen.h-screen.scroll-smooth.overflow-hidden(ref='swiperBox')
  .swiper-wrapper
    .swiper-slide.justify-center
      img.mb-10(src='~/assets/img/mine.png', class='w-[50vmin] rounded-[50%]')
      h1.mb-8.text-3xl 姚彦斌
      h1.mb-8.text-3xl 前端工程师
      .flex.justify-around(class='w-1/2')
        a(href='tel:13916533023')
          IconPhone.text-3xl
        span.relative
          IconWeChat.text-3xl(class='text-[#62B900]', @click='showWeChat = !showWeChat')
          img.absolute.w-20vw.translate-y-full.w-20vw(
            src='~/assets/img/we-chat.jpg',
            alt='we-chat',
            ref='weChatImg',
            v-show='showWeChat',
            class='bottom-[-10px] max-w-[unset] -translate-x-1/2 left-1/2'
          )
        a(href='http://wpa.qq.com/msgrd?v=3&uin=512060925&site=qq&menu=yes')
          IconQq.text-3xl(class='text-[#1594d3]')
    .swiper-slide(class='pt-[20%]')
      h1.text-3xl.mb-8 个人技能
      .flex.flex-col(class='w-[77vw]')
        .card(
          :class='{ hide: showIndex !== i }',
          v-for='(txt, i) in skillsText.filter((v, j) => j < skillsText.length / 2)',
          @click='showIndex = i'
        )
          p.w-full.h-full.break-all.overflow-hidden {{ txt }}
    .swiper-slide(class='pt-[20%]')
      h1.text-3xl.mb-8 个人技能
      .flex.flex-col(class='w-[77vw]')
        .card(
          :class='{ hide: showIndex !== i }',
          v-for='(txt, i) in skillsText.filter((v, j) => j >= skillsText.length / 2)',
          @click='showIndex = i'
        )
          p.w-full.h-full.break-all.overflow-hidden {{ txt }}
</template>
<script lang="ts" setup>
import Swiper from 'swiper'
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width,user-scalable=no,initial-scale=1',
    },
  ],
})
let swiperBox: HTMLDivElement = $ref()
let weChatImg: HTMLImageElement = $ref()
let showWeChat = $ref(false)
let showIndex = $ref(-1)
onMounted(() => {
  document.documentElement.className += ' mobile-fixed' //去除弹性滚动
  onClickOutside(weChatImg, () => (showWeChat = false))
  new Swiper(swiperBox, {
    direction: 'vertical',
    // breakpointsBase: 'container',
    on: {
      slideChange({ activeIndex }) {
        showIndex = -1
      },
    },
  })
})
</script>
<style lang="scss" scoped>
.mobile-resume {
  @apply text-[#333] bg-amber-50;

  .swiper-slide {
    @apply w-screen h-screen flex flex-col items-center;
    .card {
      @apply border-1 border-emerald shadow-lg rounded-lg p-5 mb-3 grid grid-rows-[1fr];
      transition: grid-template-rows 1s cubic-bezier(0.23, 1, 0.32, 1);
      p {
        // transition: height 1s cubic-bezier(0.23, 1, 0.32, 1);
      }
      &.hide {
        @apply grid-rows-[0fr];
        p {
          @apply h-6 text-ellipsis whitespace-nowrap;
        }
      }
    }
  }
}
</style>
