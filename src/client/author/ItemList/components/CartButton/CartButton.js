import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { Container, CartButtonWrapper, ItemsAmount } from "./styled";

const CartButton = ({ amountOfSelectedItems, onClick }) => (
  <Container onClick={onClick} disabled={!amountOfSelectedItems}>
    <CartButtonWrapper>New Test</CartButtonWrapper>
    <ItemsAmount>{amountOfSelectedItems}</ItemsAmount>
  </Container>
);

CartButton.propTypes = {
  amountOfSelectedItems: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default connect(
  state => ({
    amountOfSelectedItems: getSelectedItemSelector(state).data.length
  }),
  null
)(CartButton);
