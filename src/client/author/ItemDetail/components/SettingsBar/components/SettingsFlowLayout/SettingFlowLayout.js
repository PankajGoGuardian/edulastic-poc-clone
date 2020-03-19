import React from "react";
import { FlexContainer, CheckboxLabel } from "@edulastic/common";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Container, Heading } from "./styled";

const SettingFlowLayout = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t, disableRight }) => (
  <Container>
    <Heading>{t("component.settingsBar.flowLayout")}</Heading>
    <FlexContainer justifyContent="space-between">
      <CheckboxLabel onChange={onChangeLeft} checked={checkedLeft}>
        {t("component.settingsBar.leftColumn")}
      </CheckboxLabel>
      <CheckboxLabel onChange={onChangeRight} checked={checkedRight} disabled={disableRight}>
        {t("component.settingsBar.rightColumn")}
      </CheckboxLabel>
    </FlexContainer>
  </Container>
);

SettingFlowLayout.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  disableRight: PropTypes.bool.isRequired,
  checkedLeft: PropTypes.bool,
  checkedRight: PropTypes.bool,
  t: PropTypes.func.isRequired
};

SettingFlowLayout.defaultProps = {
  checkedLeft: false,
  checkedRight: false
};

export default withNamespaces("author")(SettingFlowLayout);
