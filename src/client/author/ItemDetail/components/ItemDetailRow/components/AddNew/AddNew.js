import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { IconEdit, IconLayout, IconMath, IconNewList, IconSelection, IconTarget } from "@edulastic/icons";
import { Container, AddNewButton, TextWrapper } from "./styled";
import { isFirstQuestionSelector } from "../../../../ducks";

const AddNew = ({ onClick, t, isFirstQuestion }) => (
  <Container>
    <AddNewButton onClick={onClick}>
      <TextWrapper>
        + {isFirstQuestion ? t("component.itemDetail.addFirstPart") : t("component.itemDetail.addNew")}
      </TextWrapper>
      <IconNewList />
      <IconSelection />
      <IconLayout />
      <IconEdit />
      <IconTarget />
      <IconMath />
    </AddNewButton>
  </Container>
);

AddNew.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("author"),
  connect(state => ({
    isFirstQuestion: isFirstQuestionSelector(state)
  }))
);

export default enhance(AddNew);
