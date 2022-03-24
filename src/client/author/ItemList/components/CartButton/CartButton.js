import { EduButton } from '@edulastic/common'
import { PropTypes } from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  getSelectedItemSelector,
  clearSelectedItemsAction,
} from '../../../TestPage/components/AddItems/ducks'
import { getTestEntitySelector } from '../../../TestPage/ducks'
import { Container, ItemsAmount } from './styled'

const CartButton = ({
  selectedItems,
  onClick,
  buttonText,
  numberChecker,
  tests,
  clearSelectedItems,
  displayDeselect = false,
}) => {
  let numberOfSelectedItems = selectedItems && selectedItems.length
  if (numberOfSelectedItems && numberChecker) {
    numberOfSelectedItems = numberChecker(
      tests.itemGroups.flatMap((itemGroup) => itemGroup.items || [])
    )
  }
  return (
    <Container>
      {numberOfSelectedItems > 0 && displayDeselect && (
        <EduButton
          data-cy="deselectItems"
          isBlue
          isGhost
          onClick={clearSelectedItems}
        >
          Deselect all items
        </EduButton>
      )}

      <EduButton
        isBlue
        isGhost
        onClick={onClick}
        data-cy="New Test"
        disabled={!numberOfSelectedItems}
      >
        <span>{buttonText}</span>
        <ItemsAmount>{numberOfSelectedItems}</ItemsAmount>
        items
      </EduButton>
    </Container>
  )
}

CartButton.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    selectedItems: getSelectedItemSelector(state),
    tests: getTestEntitySelector(state),
  }),
  { clearSelectedItems: clearSelectedItemsAction }
)(CartButton)
