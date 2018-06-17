import path from 'path'
import * as R from 'ramda'

import commonConfig from './webpack.common'

export default R.mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'build')
  },
  devServer: {
    contentBase: './build'
  }
})
