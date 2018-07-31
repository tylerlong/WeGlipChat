import Cookies from 'js-cookie'
import Framework7 from 'framework7/js/framework7'

import 'framework7/css/framework7.css'

let theme = Cookies.get('FRAMEWORK7_THEME') || 'ios'
const framework7 = new Framework7({ theme })

export default framework7
