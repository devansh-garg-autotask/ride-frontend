// import { defineConfig } from 'vite'
// import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     babel({ presets: [reactCompilerPreset()] })
//   ],
// })


import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({

  // base: '/ride-frontend/',
  base: '/',

  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    })
  ],
})