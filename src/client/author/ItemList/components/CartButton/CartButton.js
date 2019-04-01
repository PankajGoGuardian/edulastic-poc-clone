import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { createTestFromCartAction } from "../../ducks";
import { Container, CartButtonWrapper, ItemsAmount } from "./styled";

const CartButton = ({ amountOfSelectedItems, createTestFromCart }) => (
  <Container onClick={createTestFromCart}>
    <CartButtonWrapper />
    <ItemsAmount>{amountOfSelectedItems}</ItemsAmount>
  </Container>
);

CartButton.propTypes = {
  amountOfSelectedItems: PropTypes.number.isRequired,
  createTestFromCart: PropTypes.func.isRequired
};

export default connect(
  state => ({
    amountOfSelectedItems: getSelectedItemSelector(state).data.length
  }),
  {
    createTestFromCart: createTestFromCartAction
  }
)(CartButton);
