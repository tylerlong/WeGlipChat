import { join } from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import { HotModuleReplacementPlugin } from 'webpack'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: join(__dirname, 'build'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: './build',
    port: 6015,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true
  }
})

webpackConfig.module.rules[0].use.unshift('style-loader')
webpackConfig.plugins.push(new HotModuleReplacementPlugin())
webpackConfig.plugins.push(new CleanWebpackPlugin(['build']))

export default webpackConfig
