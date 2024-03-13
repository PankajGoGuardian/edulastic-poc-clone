import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { EduButton, notification } from '@edulastic/common'
import { test as testConstants } from '@edulastic/constants'
import styled from 'styled-components'
import { themeColor, white } from '@edulastic/colors'
import {
  getTestsSelector,
  addItemsToCartFromTestAction,
  getIsAddingTestToCartStateSelector,
} from '../../ducks'
import { getSelectedItemSelector } from '../../../TestPage/components/AddItems/ducks'
import WithDisableMessage from '../../../src/components/common/ToggleDisable'

const MAX_COMBINED_TEST_LIMIT = 150

const CombineTestButton = ({
  testId,
  test = {},
  selectedItems,
  addItemsToCartFromTest,
  isAddingTestToCart,
  listView = false,
}) => {
  const { testCategory, itemGroups } = test
  /** *****===========*******
  validate test category is default and proceed
  validate items in cart not exceeding the max limit
  validate if test is already added
  proceed to add to cart if all three conditions satisfy
  *******===========****** */
  const handleCombineTest = (e) => {
    e.stopPropagation()
    if (
      isAddingTestToCart ||
      testCategory !== testConstants.testCategoryTypes.DEFAULT
    ) {
      return
    }
    if (selectedItems.length >= MAX_COMBINED_TEST_LIMIT) {
      return notification({ messageKey: 'combineLimitExceeded' })
    }
    const allItemsFromTest = itemGroups.flatMap((itemGroup) =>
      itemGroup.items.map((itemScoreMap) => itemScoreMap.itemId)
    )
    const itemsFromTestWithoutCartItemIds = allItemsFromTest.filter(
      (itemId) => !selectedItems.includes(itemId)
    )
    if (itemsFromTestWithoutCartItemIds.length === 0) {
      return notification({ type: 'warn', messageKey: 'testAlreadyAdded' })
    }
    addItemsToCartFromTest({
      testId,
      itemsFromTestWithoutCartItemIds,
    })
  }
  return (
    <WithDisableMessage
      disabled={testCategory !== testConstants.testCategoryTypes.DEFAULT}
      errMessage="Video, SnapQuiz & Smart Build tests cannot be combined with other tests"
    >
      <StyledCombineBtn
        onClick={handleCombineTest}
        listView={listView}
        disabled={testCategory !== testConstants.testCategoryTypes.DEFAULT}
      >
        Add to new test
      </StyledCombineBtn>
    </WithDisableMessage>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      tests: getTestsSelector(state),
      selectedItems: getSelectedItemSelector(state),
      isAddingTestToCart: getIsAddingTestToCartStateSelector(state),
    }),
    {
      addItemsToCartFromTest: addItemsToCartFromTestAction,
    }
  )
)

export default enhance(CombineTestButton)

const StyledCombineBtn = styled(EduButton)`
  width: ${({ listView }) => (!listView ? '100%' : 'auto')};
  height: ${({ listView }) => (!listView ? '100%' : 'auto')};
  &.ant-btn.ant-btn-primary,
  &.ant-btn.ant-btn-primary:hover,
  &.ant-btn.ant-btn-primary: focus {
    ${(props) => (props.listView ? 'margin-right: 10px' : 0)};
    ${(props) => (props.listView ? 'height: 40px' : 0)};
    background-color: ${white};
    border-color: ${themeColor};
    color: ${themeColor};
  }
`
