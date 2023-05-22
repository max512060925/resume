import { cp } from 'node:fs/promises'
const dirs = ['Assets', 'ThirdParty', 'Widgets', 'Workers']
await Promise.all(
  dirs.map(name =>
    cp(
      `./node_modules/cesium/Build/Cesium/${name}`,
      `./public/cesium/${name}`,
      {
        recursive: true,
      }
    )
  )
)
