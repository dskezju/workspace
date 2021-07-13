const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = '研究空间'

module.exports = {
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/workspace/' : '/',
  lintOnSave: true,
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'assets': resolve('src/assets'),
        'pages': resolve('src/pages')
      }
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
