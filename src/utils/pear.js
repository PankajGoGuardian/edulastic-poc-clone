import appConfig from '../app-config'

const PEAR_PRODUCT_IDENTIFIER = 'EDULASTIC'

export const isPearDomain = true

export const pearIdentifyProduct = () => {
  if (window.pear && isPearDomain) {
    console.log('Pear: Identifying Product')
    window.pear.identifyProduct(PEAR_PRODUCT_IDENTIFIER)
  }
}

export const pearIdentifyUser = (token) => {
  if (window.pear && isPearDomain) {
    console.log('Pear: Identifying User')
    window.pear.identifyUser(token)
  }
}
