import * as R from 'ramda'

import commonConfig from './webpack.common'

export default R.mergeDeepRight(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build'
  }
})
