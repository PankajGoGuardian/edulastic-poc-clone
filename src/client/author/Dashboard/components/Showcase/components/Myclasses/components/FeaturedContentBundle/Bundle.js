import React from 'react'
import PropTypes from 'prop-types'

// components
import { BundleContainer, Bottom } from './styled'

const Bundle = ({ handleClick, bundle }) => {
  const onClick = () => handleClick(bundle || {})
  return (
    <BundleContainer onClick={onClick} bgImage={bundle.imageUrl}>
      <Bottom>
        {bundle.description && (
          <div data-cy={bundle.description}> {bundle.description} </div>
        )}
      </Bottom>
    </BundleContainer>
  )
}

Bundle.propTypes = {
  handleClick: PropTypes.func.isRequired,
  bundle: PropTypes.object.isRequired,
}

export default Bundle
