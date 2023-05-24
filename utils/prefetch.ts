const hrefs = [
  '/models/keqing/keqing.pmx',
  '/models/keqing/motion.vmd',
  '/models/keqing/wavefile_camera.vmd',
  '/models/keqing/summertime.wav',
  '/models/building/building.glb',
  '/textures/water/Water_1_M_Normal.jpg',
  '/textures/water/Water_2_M_Normal.jpg',
]

export const prefetch: { rel: string; href: string; as: 'fetch' }[] = hrefs.map(
  href => ({
    rel: 'prefetch',
    href,
    as: 'fetch',
  })
)
