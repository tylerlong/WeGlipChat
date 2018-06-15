import path from 'path'
import * as R from 'ramda'

import commonConfig from './webpack.common'

export default R.mergeDeepRight(commonConfig, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'docs')
  }
})
