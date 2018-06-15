import path from 'path'
import * as R from 'ramda'

import common from './webpack.common.js'

export default R.mergeDeepRight(common, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'docs')
  }
})
