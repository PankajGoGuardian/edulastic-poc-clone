import { cdnURI } from '../../../../app-config'
import loginBg from '../../../student/assets/bg-login.png'
import greatMindLogo from '../../../student/assets/GM_Horizontal.png'

export const Partners = {
  login: {
    keyName: 'login',
    name: 'login',
    headerLogo: `${cdnURI}/JS/webresources/images/as/as-dashboard-logo.png`,
    boxTitle: 'Login',
    background: false, // loginBg, background image has been removed from login page
    position: 'start',
    opacity: 0.5,
  },
  readicheck: {
    keyName: 'readicheck',
    name: 'readicheck',
    headerLogo: `${cdnURI}/default/ReadiCheckItemBank.png`,
    boxTitle: `${cdnURI}/default/readicheck_logo.png`,
    background: `${cdnURI}/default/readicheck_home-page-bg-1.png`,
    colorFilter: 'brightness(100)',
    position: 'center',
    opacity: 0.5,
  },
  greatminds: {
    keyName: 'greatminds',
    name: 'greatMind',
    headerLogo: greatMindLogo,
    boxTitle: 'Login',
    background: `${cdnURI}/default/Affirm_Background_Image.jpg`,
    colorFilter: 'brightness(1)',
    position: 'center',
    opacity: 0.2,
  },
}

export { loginBg }
