export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    const resizeMap = new WeakMap()
    const observer = new ResizeObserver(entries =>
      entries.forEach(({ target }) => resizeMap.get(target)?.())
    )
    nuxtApp.vueApp.directive('resize', {
      created(el, binding) {
        if (binding.value instanceof Function) {
          observer.observe(el)
          resizeMap.set(el, binding.value)
        }
      },
      unmounted(el) {
        if (resizeMap.get(el)) {
          observer.unobserve(el)
          resizeMap.delete(el)
        }
      },
    })
  } else {
    nuxtApp.vueApp.directive('resize', {
      getSSRProps() {
        // you can provide SSR-specific props here
        return {}
      },
    })
  }
})
