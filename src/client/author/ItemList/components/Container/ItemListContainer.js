import React, { memo, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import get from "lodash/get";
import { withRouter } from "react-router";
import Item from "../Item/Item";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import { getTestItemsSelector, getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { addItemToCartAction } from "../../ducks";
import { getUserId, getInterestedCurriculumsSelector } from "../../../src/selectors/user";
import { previewCheckAnswerAction, previewShowAnswerAction } from "../../../TestPage/ducks";
import PreviewModal from "../../../src/components/common/PreviewModal";

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
  search
}) => {
  if (!items.length) {
    return (
      <NoDataNotification
        heading="Items Not Available"
        description={
          'There are currently no items available for this filter. You can create new item by clicking the "CREATE ITEM" button.'
        }
      />
    );
  }

  const [indexForPreview, updateIndexForPreview] = useState(null);

  const closeModal = () => updateIndexForPreview(null);

  const setItemIndexForPreview = index => () => updateIndexForPreview(index);

  const nextItem = () => {
    const nextItemIndex = indexForPreview + 1;
    if (nextItemIndex > items.length - 1) {
      return;
    }
    updateIndexForPreview(nextItemIndex);
  };

  const prevItem = () => {
    const prevItemIndex = indexForPreview - 1;
    if (prevItemIndex < 0) {
      return;
    }
    updateIndexForPreview(prevItemIndex);
  };

  const selectedItem = get(items, `[${indexForPreview}]`, null);
  const owner = get(selectedItem, "authors", []).some(x => x._id === userId);

  const checkItemAnswer = () => checkAnswer({ ...selectedItem, isItem: true });
  const showItemAnswer = () => showAnswer(selectedItem);

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
          owner={owner}
          testId={test?._id}
          isTest={!!test}
          prevItem={prevItem}
          nextItem={nextItem}
          onClose={closeModal}
          checkAnswer={checkItemAnswer}
          showAnswer={showItemAnswer}
        />
      )}
      {items.map((item, index) => (
        <Item
          key={item._id}
          item={item}
          history={history}
          userId={userId}
          windowWidth={windowWidth}
          onToggleToCart={addItemToCart}
          selectedToCart={selectedCartItems ? selectedCartItems.includes(item._id) : false}
          interestedCurriculums={interestedCurriculums}
          openPreviewModal={setItemIndexForPreview(index)}
          checkAnswer={checkAnswer}
          showAnswer={showAnswer}
          search={search}
          page="itemList"
        />
      ))}
    </>
  );
};

export default compose(
  memo,
  withRouter,
  connect(
    state => ({
      items: getTestItemsSelector(state),
      selectedCartItems: getSelectedItemSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      userId: getUserId(state)
    }),
    {
      addItemToCart: addItemToCartAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction
    }
  )
)(ItemListContainer);
