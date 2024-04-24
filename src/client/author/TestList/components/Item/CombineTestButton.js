import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  EduButton,
  notification,
  EduIf,
  EduElse,
  EduThen,
  FlexContainer,
} from '@edulastic/common'
import { test as testConstants } from '@edulastic/constants'
import styled from 'styled-components'
import { themeColor, white } from '@edulastic/colors'
import { Tooltip } from 'antd'
import {
  getTestsSelector,
  addItemsToCartFromTestAction,
  getIsAddingTestToCartStateSelector,
} from '../../ducks'
import { getSelectedItemSelector } from '../../../TestPage/components/AddItems/ducks'

const MAX_COMBINED_TEST_LIMIT = 150

const CombineTestButton = ({
  testId,
  test = {},
  selectedItems,
  addItemsToCartFromTest,
  isAddingTestToCart,
  listView = false,
  isTestCard = false,
  width,
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

  const combinedBtnProps = {
    onClick: handleCombineTest,
    listView,
    disabled: testCategory !== testConstants.testCategoryTypes.DEFAULT,
  }

  const combinedBtnText = 'Add to new test'

  const tooltipText =
    testCategory !== testConstants.testCategoryTypes.DEFAULT
      ? 'Video, SnapQuiz & Smart Build tests cannot be combined with other tests'
      : undefined

  return (
    <EduIf condition={!isTestCard}>
      <EduThen>
        <Tooltip title={tooltipText}>
          <StyledCombineBtnContainer listView={listView}>
            <StyledCombineBtn {...combinedBtnProps}>
              {combinedBtnText}
            </StyledCombineBtn>
          </StyledCombineBtnContainer>
        </Tooltip>
      </EduThen>
      <EduElse>
        <Tooltip title={tooltipText}>
          <FlexContainer width="100%">
            <EduButton {...combinedBtnProps} ml="0px" width={width}>
              {combinedBtnText}
            </EduButton>
          </FlexContainer>
        </Tooltip>
      </EduElse>
    </EduIf>
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

const StyledCombineBtnContainer = styled.div`
  width: 110%;
  height: 100%;
  margin-right: ${({ listView }) => (!listView ? '5px' : 'auto')};
  display: ${({ listView }) => (!listView ? 'block' : 'inline')};
`

const StyledCombineBtn = styled(EduButton)`
  width: ${({ listView }) => (listView ? 'auto' : '100%')};
  height: ${({ listView }) => (listView ? 'auto' : '40px !important')};

  &.ant-btn.ant-btn-primary, ${({ listView }) =>
    listView ? '&.ant-btn.ant-btn-primary:hover,' : ''}
  &.ant-btn.ant-btn-primary: focus {
    ${(props) => (props.listView ? 'margin-right: 10px' : 0)};
    ${(props) => (props.listView ? 'height: 36px' : '40px')};
    background-color: ${white};
    border-color: ${themeColor};
    color: ${themeColor};
  }
`
