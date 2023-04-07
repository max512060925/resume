<template lang="pug">
.resume
  .page.pt-10
    .mine
      img.z-10.absolute.z-10(
        src='~/assets/img/mine.png',
        class='rounded-[50%] w-[180px] h-[180px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      )
      .linear
        span(v-for='n in 4')
    .info.flex.flex-col
      h1 Hello~ 你好!
      h1 我是姚彦斌
      h1 一名有着8年前端开发经验的开发者
  .page 1
  .page 2
//- NuxtLink(to='/3D/Keqing') 刻晴
//- NuxtLink(to='/About') about
//- NuxtLink(to='/fireword') fireword
</template>
<script lang="ts" setup>
useHead({
  title: '姚彦斌的个人简历',
})
//-       我是一名有着10年前端开发经验的开发者，经历了多个项目的开发、迭代和维护。在这10年的职业生涯中，我积累了丰富的技术和管理经验，取得了一系列优秀的成果。

//- 在早期的职业生涯中，我主要负责开发基于 HTML、CSS和JavaScript的网页。通过深入钻研JavaScript和jQuery等前端框架，我开发了许多交互性强、用户体验优秀的网站。同时也学习了node.js、Vue.js等新技术并运用到实际开发中，提升了我的开发效率和代码质量。

//- 后来，我参与了一些大型的项目，担任前端架构师和团队经理的角色。我带领团队完成了多个复杂的产品，并在开发流程中不断改善、优化，提高项目的质量和效率。在这些项目中，我提出了许多创新性的解决方案，例如采用React框架和Webpack工具优化开发流程等，都取得了非常好的效果。

//- 此外，我也在个人时间里持续学习和不断拓展自己的技术和管理知识，例如学习了iOS和Android开发知识，理解和应用了敏捷开发方法论和Scrum项目管理方法等，这些经验和知识让我在职业生涯中更加成功和领导力强。

//- 总的来说，我的10年经历充满了挑战和成就，我具备深厚的前端技术和全面的管理能力，期待着把这些经验和能力应用到新的职业发展中。
</script>
<style lang="scss" scoped>
.linear-gradient {
  @apply bg-gradient-to-b from-sky-400 via-amber-200 to-fuchsia-500;
}
.resume {
  @apply w-screen h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-[rgb(15,12,42)];
  &::-webkit-scrollbar {
    width: 0;
  }
  .page {
    @apply w-screen h-screen snap-start snap-always;
  }
  .mine {
    @apply relative mx-auto w-[190px] h-[190px];
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
      &:after {
        animation-play-state: paused;
      }
    }
  }
  .info {
    h1 {
      @apply text-white mx-auto my-5 text-5xl inline-block relative overflow-hidden;

      &:before {
        @apply content-[''] absolute block w-[200%] h-full bg-gradient-to-r from-amber-200 from-50% via-[rgb(15,12,42)] via-[50.01%] to-[rgb(15,12,42)] to-100% will-change-transform translate-x-[-50%] animate-[to-right-hide_1.2s_ease-in-out_both];
      }
      &:last-child:after {
        @apply content-['|'] animate-toggle opacity-0;
        animation-delay: 1.2s;
      }
    }
  }
}
</style>
