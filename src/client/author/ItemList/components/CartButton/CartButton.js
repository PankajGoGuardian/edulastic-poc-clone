import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { getTestEntitySelector } from "../../../TestPage/ducks";
import { Container, CartButtonWrapper, ItemsAmount } from "./styled";

const CartButton = ({ selectedItems, onClick, buttonText, numberChecker, tests }) => {
  let numberOfSelectedItems = selectedItems && selectedItems.length;
  if (numberOfSelectedItems && numberChecker) {
    numberOfSelectedItems = numberChecker(tests.itemGroups.flatMap(itemGroup => itemGroup.items || []));
  }
  return (
    <Container onClick={onClick} disabled={!numberOfSelectedItems}>
      <CartButtonWrapper>
        <span>{buttonText}</span>
        <ItemsAmount>{numberOfSelectedItems}</ItemsAmount>
      </CartButtonWrapper>
    </Container>
  );
};

CartButton.propTypes = {
  selectedItems: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedItems: getSelectedItemSelector(state),
    tests: getTestEntitySelector(state)
  }),
  null
)(CartButton);
