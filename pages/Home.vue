<template lang="pug">
ClientOnly
  MobileResume(v-if='isMobile')
  PCResume(v-else)
</template>
<script lang="ts" setup>
const nuxtApp = useNuxtApp()
if (process.server) {
  const event = useRequestEvent()
  nuxtApp.payload.data.isMobile = event.context.isMobile
}
const { isMobile } = nuxtApp.payload.data
</script>
