import React from 'react'
import PropTypes from 'prop-types'

// components
import { BundleContainer, Bottom } from './styled'

const Bundle = ({ handleClick, bundle }) => (
  <BundleContainer onClick={handleClick} bgImage={bundle.imageUrl}>
    <Bottom>{bundle.description && <div> {bundle.description} </div>}</Bottom>
  </BundleContainer>
)

Bundle.propTypes = {
  handleClick: PropTypes.func.isRequired,
  bundle: PropTypes.object.isRequired,
}

export default Bundle
