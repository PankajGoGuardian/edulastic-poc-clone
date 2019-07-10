import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { IconEdit, IconLayout, IconMath, IconNewList, IconSelection, IconTarget } from "@edulastic/icons";
import { Container, AddNewButton, TextWrapper } from "./styled";

const AddNew = ({ onClick, t }) => (
  <Container>
    <AddNewButton onClick={onClick}>
      <TextWrapper>+ {t("component.itemDetail.addNew")}</TextWrapper>
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

export default withNamespaces("author")(AddNew);
