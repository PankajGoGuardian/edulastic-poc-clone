import { EduButton } from '@edulastic/common'
import { PropTypes } from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  getSelectedItemSelector,
  clearSelectedItemsAction,
} from '../../../TestPage/components/AddItems/ducks'
import {
  clearTestDataAction,
  getTestEntitySelector,
} from '../../../TestPage/ducks'
import { Container, ItemsAmount, StyledBetaTag } from './styled'

const CartButton = ({
  selectedItems,
  onClick,
  buttonText,
  numberChecker,
  tests,
  clearSelectedItems,
  displayDeselect = false,
  clearTestData,
}) => {
  let numberOfSelectedItems = selectedItems && selectedItems.length
  if (numberOfSelectedItems && numberChecker) {
    numberOfSelectedItems = numberChecker(
      tests.itemGroups.flatMap((itemGroup) => itemGroup.items || [])
    )
  }
  useEffect(() => {
    if (tests?._id) {
      clearSelectedItems()
      clearTestData()
    }
  }, [tests?._id])

  return (
    <Container rightMargin={displayDeselect}>
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
        <ItemsAmount threeDigit={numberOfSelectedItems > 99}>
          {numberOfSelectedItems}
        </ItemsAmount>
        items
        {displayDeselect && (
          <StyledBetaTag alignItems="left">BETA</StyledBetaTag>
        )}
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
  {
    clearSelectedItems: clearSelectedItemsAction,
    clearTestData: clearTestDataAction,
  }
)(CartButton)
