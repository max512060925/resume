<template lang="pug">
.test.w-full.h-full
  el-button(@click='show = !show') test
  //- 
  .grid(:class='show ? "grid-rows-[1fr]" : "grid-rows-[0fr]"')
    .overflow-hidden
      div Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur vitae delectus ullam ducimus impedit sit, earum blanditiis explicabo incidunt repellat autem in dicta eaque deserunt non necessitatibus molestias? Dolorum, dolore. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur vitae delectus ullam ducimus impedit sit, earum blanditiis explicabo incidunt repellat autem in dicta eaque deserunt non necessitatibus molestias? Dolorum, dolore. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur vitae delectus ullam ducimus impedit sit, earum blanditiis explicabo incidunt repellat autem in dicta eaque deserunt non necessitatibus molestias? Dolorum, dolore. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur vitae delectus ullam ducimus impedit sit, earum blanditiis explicabo incidunt repellat autem in dicta eaque deserunt non necessitatibus molestias? Dolorum, dolore.
</template>
<script lang="ts" setup>
let show = $ref(false)
</script>
<style lang="scss" scoped>
.test {
  .grid {
    transition: grid-template-rows 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    // display: grid;
    // grid-template-rows: 0fr;
    // overflow: hidden;
  }
}
</style>
