import React from "react";
import { FlexContainer, CheckboxLabel } from "@edulastic/common";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Container, Heading } from "./styled";

const SettingsBarUseTabs = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t, disableRight }) => (
  <Container>
    <Heading>{t("component.settingsBar.useTabs")}</Heading>
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

SettingsBarUseTabs.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  checkedLeft: PropTypes.bool.isRequired,
  disableRight: PropTypes.bool.isRequired,
  checkedRight: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("author")(SettingsBarUseTabs);
