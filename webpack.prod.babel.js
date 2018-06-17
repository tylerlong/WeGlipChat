import path from 'path'
import { mergeDeepRight } from 'ramda'

import commonConfig from './webpack.common'

export default mergeDeepRight(commonConfig, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'docs')
  }
})
