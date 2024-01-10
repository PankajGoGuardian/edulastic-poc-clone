import React, { memo, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { withRouter } from 'react-router'
import Item from '../Item/Item'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import {
  getTestItemsSelector,
  getSelectedItemSelector,
} from '../../../TestPage/components/AddItems/ducks'
import { addItemToCartAction } from '../../ducks'
import {
  getUserId,
  getInterestedCurriculumsSelector,
  getUserRole,
} from '../../../src/selectors/user'

import {
  previewCheckAnswerAction,
  previewShowAnswerAction,
} from '../../../TestPage/ducks'
import PreviewModal from '../../../src/components/common/PreviewModal'
import { resetItemScoreAction } from '../../../src/ItemScore/ducks'
import {
  itemInPreviewModalSelector,
  setPrevewItemAction,
} from '../../../src/components/common/PreviewModal/ducks'
import { ExpandContainer } from './styled'

const ItemListContainer = ({
  items,
  test,
  history,
  windowWidth,
  addItemToCart,
  selectedCartItems,
  userId,
  checkAnswer,
  showAnswer,
  interestedCurriculums,
  search,
  userRole,
  resetScore,
  setPrevewItem,
  itemDetailPreview,
}) => {
  if (!items.length) {
    return (
      <NoDataNotification
        heading="Items Not Available"
        description={
          'There are currently no items available for this filter. You can create new item by clicking the "NEW ITEM" button.'
        }
      />
    )
  }

  const [indexForPreview, updateIndexForPreview] = useState(null)
  const [indexForExpand, updateIndexForExpand] = useState(-1)

  const closeModal = () => updateIndexForPreview(null)

  const setItemIndexForPreview = (index) => () => updateIndexForPreview(index)

  const nextItem = () => {
    const nextItemIndex = indexForPreview + 1
    if (nextItemIndex > items.length - 1) {
      return
    }
    updateIndexForPreview(nextItemIndex)
  }

  const prevItem = () => {
    const prevItemIndex = indexForPreview - 1
    if (prevItemIndex < 0) {
      return
    }
    updateIndexForPreview(prevItemIndex)
  }

  const selectedItem = get(items, `[${indexForPreview}]`, null)
  const owner = get(selectedItem, 'authors', []).some((x) => x._id === userId)

  const itemForEvaluation = useMemo(() => {
    let source = selectedItem
    if (itemDetailPreview?._id) {
      /**
       * when items are filtered using an id, but that item is a passage item
       * and it contains more than one item
       * so, in the items[] we shall have only 1 item, the filtered id
       * however, in the previewModal, we can paginate and get other items of the passage
       * so, we need to evaluate the current item that is displayed, not the item which was opened
       * @see https://snapwiz.atlassian.net/browse/EV-28461
       */
      source = itemDetailPreview
    }
    return source
  }, [selectedItem, itemDetailPreview])

  const checkItemAnswer = () => {
    checkAnswer({ ...itemForEvaluation, isItem: true })
  }

  const showItemAnswer = () => {
    showAnswer(itemForEvaluation)
  }

  /**
   * Syncs the current item returned from passage API, after paginating,
   * with the local state used to show current item
   * @param {string} id item id associated with passage, that is to be displayed
   */
  const updateCurrentItemFromPassagePagination = (id) => {
    const hasSameItemId = (item) => item._id === id
    if (id) {
      const index = items.findIndex(hasSameItemId)
      if (index !== -1) {
        resetScore() // we should reset the score block, or it retains old data
        updateIndexForPreview(index)
        const testItem = get(items, `[${index}]`, null)
        setPrevewItem(testItem) // setting testPreviewItem
      }
    }
  }

  return (
    <>
      {selectedItem && (
        <PreviewModal
          isVisible={!!selectedItem}
          page="itemList"
          showAddPassageItemToTestButton
          showEvaluationButtons
          data={{ ...selectedItem, id: selectedItem._id }}
          isEditable={owner}
          userRole={userRole}
          owner={owner}
          testId={test?._id}
          isTest={!!test}
          prevItem={prevItem}
          nextItem={nextItem}
          onClose={closeModal}
          checkAnswer={checkItemAnswer}
          showAnswer={showItemAnswer}
          updateCurrentItemFromPassagePagination={
            updateCurrentItemFromPassagePagination
          }
        />
      )}
      {items.map(({ inner_items = [], ...item }, index) => (
        <div>
          <Item
            key={item._id}
            item={item}
            history={history}
            userId={userId}
            windowWidth={windowWidth}
            onToggleToCart={addItemToCart}
            selectedToCart={
              selectedCartItems ? selectedCartItems.includes(item._id) : false
            }
            interestedCurriculums={interestedCurriculums}
            openPreviewModal={setItemIndexForPreview(index)}
            checkAnswer={checkAnswer}
            showAnswer={showAnswer}
            search={search}
            page="itemList"
            updateIndexForExpand={() =>
              indexForExpand === index
                ? updateIndexForExpand(-1)
                : updateIndexForExpand(index)
            }
            innerCount={inner_items.length}
          />
          <ExpandContainer height={indexForExpand == index}>
            <div style={{ padding: '20px 20px 20px 50px' }}>
              {inner_items.map((_item, _index) => {
                return (
                  <Item
                    key={_item._id}
                    item={_item}
                    history={history}
                    userId={userId}
                    windowWidth={windowWidth}
                    onToggleToCart={addItemToCart}
                    selectedToCart={
                      selectedCartItems
                        ? selectedCartItems.includes(_item._id)
                        : false
                    }
                    interestedCurriculums={interestedCurriculums}
                    openPreviewModal={setItemIndexForPreview(_index)}
                    checkAnswer={checkAnswer}
                    showAnswer={showAnswer}
                    search={search}
                    page="itemList"
                    last={_index === inner_items.length - 1}
                  />
                )
              })}
            </div>
          </ExpandContainer>
        </div>
      ))}
    </>
  )
}

export default compose(
  memo,
  withRouter,
  connect(
    (state) => ({
      items: getTestItemsSelector(state),
      selectedCartItems: getSelectedItemSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      userId: getUserId(state),
      userRole: getUserRole(state),
      itemDetailPreview: itemInPreviewModalSelector(state),
    }),
    {
      addItemToCart: addItemToCartAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      resetScore: resetItemScoreAction,
      setPrevewItem: setPrevewItemAction,
    }
  )
)(ItemListContainer)
