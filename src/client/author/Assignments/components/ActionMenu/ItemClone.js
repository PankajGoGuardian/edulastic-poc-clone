import React from 'react'
import PropTypes from 'prop-types'
import { StyledLink, SpaceElement } from './styled'
import copyItem from '../../assets/copy-item.svg'

function DuplicateTest({ duplicateTest }) {
  return (
    <StyledLink
      target="_blank"
      rel="noopener noreferrer"
      onClick={duplicateTest}
    >
      <img alt="icon" src={copyItem} />
      <SpaceElement />
      Clone
    </StyledLink>
  )
}

DuplicateTest.propTypes = {
  duplicateTest: PropTypes.func.isRequired,
}

export default DuplicateTest
