import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { Container, CartButtonWrapper, ItemsAmount } from "./styled";

const CartButton = ({ SelectedItems, onClick }) => {
  const numberOfSelectedItems = SelectedItems && SelectedItems.data && SelectedItems.data.length;
  return (
    <Container onClick={onClick} disabled={!numberOfSelectedItems}>
      <CartButtonWrapper>Author Test</CartButtonWrapper>
      <ItemsAmount>{numberOfSelectedItems}</ItemsAmount>
    </Container>
  );
};

CartButton.propTypes = {
  SelectedItems: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

export default connect(
  state => ({
    SelectedItems: getSelectedItemSelector(state)
  }),
  null
)(CartButton);
