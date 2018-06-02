module.exports = {
  baseUrl: '/',
  configureWebpack (config) {
    config.performance = { hints: false }
    config.devtool = process.env.NODE_ENV === 'production' ? false : 'cheap-module-eval-source-map'
  }
}
