import React from "react";
import { Checkbox, FlexContainer } from "@edulastic/common";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Container, Heading } from "./styled";

const SettingFlowLayout = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t }) => (
  <Container>
    <Heading>{t("component.settingsBar.flowLayout")}</Heading>
    <FlexContainer justifyContent="space-between">
      <Checkbox label={t("component.settingsBar.leftColumn")} onChange={onChangeLeft} checked={checkedLeft} />
      <Checkbox label={t("component.settingsBar.rightColumn")} onChange={onChangeRight} checked={checkedRight} />
    </FlexContainer>
  </Container>
);

SettingFlowLayout.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  checkedLeft: PropTypes.bool,
  checkedRight: PropTypes.bool,
  t: PropTypes.func.isRequired
};

SettingFlowLayout.defaultProps = {
  checkedLeft: false,
  checkedRight: false
};

export default withNamespaces("author")(SettingFlowLayout);
