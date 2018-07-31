import Cookies from 'js-cookie'

let theme = Cookies.get('FRAMEWORK7_THEME') || 'ios'
const framework7 = new window.Framework7({ theme })

export default framework7
