import { EduButton } from "@edulastic/common";
import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Container, ItemsAmount } from "../../../ItemList/components/CartButton/styled";
import { getSelectedTestsSelector } from "../../ducks";

const CartButton = ({ selectedTests, onClick, buttonText, numberChecker }) => {
  let numberOfSelectedTests = selectedTests && selectedTests.length;
  if (numberOfSelectedTests && numberChecker) {
    numberOfSelectedTests = numberChecker(selectedTests);
  }
  return (
    <Container onClick={onClick} disabled={!numberOfSelectedTests}>
      <EduButton isGhost>
        <span>{buttonText}</span>
        <ItemsAmount>{numberOfSelectedTests}</ItemsAmount>
      </EduButton>
    </Container>
  );
};

CartButton.propTypes = {
  selectedTests: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default connect(
  state => ({
    selectedTests: getSelectedTestsSelector(state)
  }),
  null
)(CartButton);
