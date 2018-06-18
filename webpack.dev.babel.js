import path from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'build')
  },
  devServer: {
    contentBase: './build'
  }
})

webpackConfig.plugins.push(new CleanWebpackPlugin(['build']))

export default webpackConfig
