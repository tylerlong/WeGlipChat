import path from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import { HotModuleReplacementPlugin } from 'webpack'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'build')
  },
  devServer: {
    contentBase: './build',
    port: 6015,
    inline: false,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true
  }
})

webpackConfig.plugins.push(new CleanWebpackPlugin(['build']))
webpackConfig.plugins.push(new HotModuleReplacementPlugin())

export default webpackConfig
