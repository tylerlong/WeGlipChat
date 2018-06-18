import path from 'path'
import { mergeDeepRight } from 'ramda'
import CleanWebpackPlugin from 'clean-webpack-plugin'

import commonConfig from './webpack.common'

const webpackConfig = mergeDeepRight(commonConfig, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'docs')
  }
})

webpackConfig.plugins.push(new CleanWebpackPlugin(['docs']))

export default webpackConfig
