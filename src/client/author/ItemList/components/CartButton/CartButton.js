import { EduButton } from '@edulastic/common'
import { PropTypes } from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import {
  getSelectedItemSelector,
  clearSelectedItemsAction,
} from '../../../TestPage/components/AddItems/ducks'
import {
  clearTestDataAction,
  getCartTestSelector,
} from '../../../TestPage/ducks'
import { Container, ItemsAmount } from './styled'

const CartButton = ({
  selectedItems,
  onClick,
  buttonText,
  numberChecker,
  tests,
  clearSelectedItems,
  clearTestData,
  displayDeselect = false,
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
      <Tooltip
        title={
          displayDeselect
            ? 'Combine upto 150 items from test and item library and create a test'
            : ''
        }
      >
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
        </EduButton>
      </Tooltip>
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
    tests: getCartTestSelector(state),
  }),
  {
    clearSelectedItems: clearSelectedItemsAction,
    clearTestData: clearTestDataAction,
  }
)(CartButton)
