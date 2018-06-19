import { join } from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import ExtractCssChunksPlugin from 'extract-css-chunks-webpack-plugin'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: join(__dirname, 'docs'),
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})

webpackConfig.module.rules[0].use.unshift(ExtractCssChunksPlugin.loader)
webpackConfig.plugins.push(new ExtractCssChunksPlugin({ filename: '[name].[chunkhash].css' }))
webpackConfig.plugins.push(new CleanWebpackPlugin(['docs']))

export default webpackConfig
