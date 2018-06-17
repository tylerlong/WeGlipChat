import path from 'path'
import { mergeDeepRight } from 'ramda'

import commonConfig from './webpack.common'

export default mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'build')
  },
  devServer: {
    contentBase: './build'
  }
})
