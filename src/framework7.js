import Template7 from 'template7'
import $ from 'dom7'

// F7 Class
import Framework7 from 'framework7/dist/components/core/core-class'

// Import Helpers
import Request from 'framework7/dist/utils/request'
import Utils from 'framework7/dist/utils/utils'
import Support from 'framework7/dist/utils/support'
import Device from 'framework7/dist/utils/device'

// Core Modules
import DeviceModule from 'framework7/dist/modules/device/device'
import SupportModule from 'framework7/dist/modules/support/support'
import UtilsModule from 'framework7/dist/modules/utils/utils'
import ResizeModule from 'framework7/dist/modules/resize/resize'
import RequestModule from 'framework7/dist/modules/request/request'
import TouchModule from 'framework7/dist/modules/touch/touch'
import RouterModule from 'framework7/dist/modules/router/router'
import HistoryModule from 'framework7/dist/modules/history/history'
import StorageModule from 'framework7/dist/modules/storage/storage'

// Core Components
import Statusbar from 'framework7/dist/components/statusbar/statusbar'
import View from 'framework7/dist/components/view/view'
import Navbar from 'framework7/dist/components/navbar/navbar'
import Toolbar from 'framework7/dist/components/toolbar/toolbar'
import Subnavbar from 'framework7/dist/components/subnavbar/subnavbar'
import TouchRipple from 'framework7/dist/components/touch-ripple/touch-ripple'
import Modal from 'framework7/dist/components/modal/modal'

// Install Core Modules & Components
Framework7.use([
  DeviceModule,
  SupportModule,
  UtilsModule,
  ResizeModule,
  RequestModule,
  TouchModule,
  RouterModule,
  HistoryModule,
  StorageModule,
  Statusbar,
  View,
  Navbar,
  Toolbar,
  Subnavbar,
  TouchRipple,
  Modal
])

export { Template7, $ as Dom7, Request, Utils, Device, Support }
export default Framework7
