import { createWebHashHistory, createRouter } from 'vue-router'
const views = import.meta.glob('../views/*.vue')

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    ...Object.entries(views).map(
      ([name, component]) => (
        (name = name.split(/\//g).pop().split(/\./g)[0]),
        {
          path: `/${name.toLocaleLowerCase()}`,
          name,
          component,
        }
      )
    ),
    { path: '/:pathMatch(.*)*', name: '404', redirect: '/keqing' },
  ],
})
