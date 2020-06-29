import { EduButton } from "@edulastic/common";
import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { getTestEntitySelector } from "../../../TestPage/ducks";
import { Container, ItemsAmount } from "./styled";

const CartButton = ({ selectedItems, onClick, buttonText, numberChecker, tests }) => {
  let numberOfSelectedItems = selectedItems && selectedItems.length;
  if (numberOfSelectedItems && numberChecker) {
    numberOfSelectedItems = numberChecker(tests.itemGroups.flatMap(itemGroup => itemGroup.items || []));
  }
  return (
    <Container data-cy={buttonText} onClick={onClick} disabled={!numberOfSelectedItems}>
      <EduButton isBlue isGhost>
        <span>{buttonText}</span>
        <ItemsAmount>{numberOfSelectedItems}</ItemsAmount>
      </EduButton>
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
