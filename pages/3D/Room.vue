<template lang="pug">
.w-full.h-full
</template>
<script lang="ts" setup>
const getRoomData = async () => {
  const res: string = await $fetch(
    'https://vr4cdn.5i5j.com/WoAiWoJia-8330701_abb8a74d-cbd1-474a-9339-b9904b2db634/ViewData.txt'
  )
  const data = JSON.parse(res)
  console.log(data)
}
getRoomData()
</script>
