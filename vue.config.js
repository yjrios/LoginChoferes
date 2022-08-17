const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave:false,
  css: {
    extract: {
      ignoreOrder: true
    },
  },
  publicPath: ''
})
