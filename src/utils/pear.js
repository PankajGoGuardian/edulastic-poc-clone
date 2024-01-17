import appConfig from '../app-config'

const PEAR_PRODUCT_IDENTIFIER = 'EDULASTIC'

// Setting isPearDomain true for old as well as new domain from Jan 21st 2024 release
export const isPearDomain =
  window.location.host
    .toLowerCase()
    .includes(appConfig.pearScriptDomainIdentifier) || true

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
