import Framework7 from 'framework7'
import Popup from 'framework7/components/popup/popup.js'
import Messages from 'framework7/components/messages/messages.js'
import Cookies from 'js-cookie'

import 'framework7/css/framework7.css'

Framework7.use([Popup, Messages])

let theme = Cookies.get('FRAMEWORK7_THEME') || 'ios'
const framework7 = new Framework7({ theme })

export default framework7
