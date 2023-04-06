/** @type {import('tailwindcss').Config} */

export default {
  theme: {
    extend: {
      // colors: {
      //   primary: 'var(--el-color-primary)',
      //   success: 'var(--el-color-success)',
      //   warning: 'var(--el-color-warning)',
      //   danger: 'var(--el-color-danger)',
      //   error: 'var(--el-color-error)',
      //   info: 'var(--el-color-info)',
      // },
      animation: {
        toggle: 'opacity 0.9s infinite',
      },
      keyframes: {
        opacity: {
          '30%': {
            opacity: '1',
          },
        },
        'to-right-hide': {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [],
}
