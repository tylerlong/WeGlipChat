import { join } from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import { HotModuleReplacementPlugin } from 'webpack'
import ExtractCssChunksPlugin from 'extract-css-chunks-webpack-plugin'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
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

webpackConfig.plugins.push(new ExtractCssChunksPlugin({ filename: '[name].css' }))
webpackConfig.plugins.push(new HotModuleReplacementPlugin())
webpackConfig.plugins.push(new CleanWebpackPlugin(['build']))

export default webpackConfig
