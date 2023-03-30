<template lang="pug">
.chat
</template>
<style lang="scss" scoped>
.chat {
  @apply bg-slate-700 w-full h-full;
  tab-size: 4;
  &:after {
    @apply content-[''] fixed w-full h-1/5 bg-gradient-to-b from-slate-800 left-0 bottom-0 z-10;
  }
}
</style>
