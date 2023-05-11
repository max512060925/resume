import { rm, cp } from 'fs/promises'
import { runCommand } from 'nuxi'

await rm('./public/cesium', { recursive: true })
await runCommand('build')

const dirs = ['Assets', 'ThirdParty', 'Widgets', 'Workers']
await Promise.all(
  dirs.map(name =>
    cp(
      `./node_modules/cesium/Build/Cesium/${name}`,
      `./.output/public/cesium/${name}`,
      {
        recursive: true,
      }
    )
  )
)
