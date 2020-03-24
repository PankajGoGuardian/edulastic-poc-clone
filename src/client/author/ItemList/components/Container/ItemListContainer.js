import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import Item from "../Item/Item";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import { getTestItemsSelector, getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { addItemToCartAction } from "../../ducks";
import { getUserId, getInterestedCurriculumsSelector } from "../../../src/selectors/user";
import { previewCheckAnswerAction, previewShowAnswerAction } from "../../../TestPage/ducks";

const ItemListContainer = ({
  items,
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

  return items.map(item => (
    <Item
      key={item._id}
      item={item}
      history={history}
      userId={userId}
      windowWidth={windowWidth}
      onToggleToCart={addItemToCart}
      selectedToCart={selectedCartItems ? selectedCartItems.includes(item._id) : false}
      interestedCurriculums={interestedCurriculums}
      checkAnswer={checkAnswer}
      showAnswer={showAnswer}
      search={search}
      page="itemList"
    />
  ));
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
