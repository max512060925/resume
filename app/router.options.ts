import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  routes: _routes => {
    // const home = _routes.find(({ name }) => name === 'Home')
    // home.path = '/'
    return [
      ..._routes,
      { path: '/:pathMatch(.*)*', name: '404', redirect: '/Chat' },
    ]
  },
}
