import * as R from 'ramda'

import common from './webpack.common.js'

export default R.mergeDeepRight(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build'
  }
})
