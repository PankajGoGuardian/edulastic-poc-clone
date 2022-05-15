import React from 'react'
import PropTypes from 'prop-types'

// components
import { BundleContainer, Bottom } from './styled'

const Bundle = ({ handleClick, bundle }) => {
  const onClick = () => handleClick(bundle || {})
  return (
    <BundleContainer
      data-testid="preBuiltTests"
      onClick={onClick}
      bgImage={bundle.imageUrl}
      data-cy={
        bundle.description || bundle?.config?.subscriptionData?.productName
      }
    >
      <Bottom>{bundle.description && <div>{bundle.description}</div>}</Bottom>
    </BundleContainer>
  )
}

Bundle.propTypes = {
  handleClick: PropTypes.func.isRequired,
  bundle: PropTypes.object.isRequired,
}

export default Bundle
