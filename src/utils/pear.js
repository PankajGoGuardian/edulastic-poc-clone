import appConfig from '../app-config'

const PEAR_PRODUCT_IDENTIFIER = 'EDULASTIC'

export const isPearDomain = window.location.host
  .toLowerCase()
  .includes(appConfig.pearScriptDomainIdentifier)

// This Flag will be set to true from 22nd Jan to show icon and text change in old domain
export const showPearContent = isPearDomain

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
