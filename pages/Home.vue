<template lang="pug">
component(:is='isMobile ? mobileResume : pcResume')
</template>
<script lang="ts" setup>
import pcResume from '~/pc/Resume.vue'
import mobileResume from '~/mobile/Resume.vue'

const nuxtApp = useNuxtApp()
if (process.server) {
  const event = useRequestEvent()
  nuxtApp.payload.data.isMobile = event.context.isMobile
}
let { isMobile } = nuxtApp.payload.data
</script>
