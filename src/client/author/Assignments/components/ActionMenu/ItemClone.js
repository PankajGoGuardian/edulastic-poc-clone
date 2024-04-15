import React, { useState } from 'react'
import PropTypes from 'prop-types'

import CloneModal from '../../../TestPage/components/ItemCloneConfirmationModal'
import { StyledLink, SpaceElement } from './styled'
import copyItem from '../../assets/copy-item.svg'

function DuplicateTest({ duplicateTest }) {
  const [isModalVisible, toggleModalVisibility] = useState(false)

  const handleOnClick = () => {
    toggleModalVisibility(true)
  }

  return (
    <>
      <StyledLink
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOnClick}
      >
        <img alt="icon" src={copyItem} />
        <SpaceElement />
        Clone
      </StyledLink>
      <CloneModal
        visible={isModalVisible}
        toggleVisibility={toggleModalVisibility}
        handleDuplicateTest={duplicateTest}
      />
    </>
  )
}

DuplicateTest.propTypes = {
  duplicateTest: PropTypes.func.isRequired,
}

export default DuplicateTest
