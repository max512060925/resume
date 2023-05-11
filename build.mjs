import { rm, cp } from 'fs/promises'
import { runCommand } from 'nuxi'
import { zip } from 'compressing'

await rm('./public/cesium', { recursive: true, force: true })
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
// await rm('./.output/server/node_modules', {
//   recursive: true,
//   force: true,
// })
zip.compressDir('.output', 'dist.zip')
