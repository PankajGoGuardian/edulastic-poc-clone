import React from "react";
import { FlexContainer } from "@edulastic/common";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Container, Heading } from "./styled";
import { EduCheckBox } from "@edulastic/common";

const SettingsBarUseTabs = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t, disableRight }) => (
  <Container>
    <Heading>{t("component.settingsBar.useTabs")}</Heading>
    <FlexContainer justifyContent="space-between">
      <EduCheckBox onChange={onChangeLeft} checked={checkedLeft}>
        {t("component.settingsBar.leftColumn")}
      </EduCheckBox>
      <EduCheckBox onChange={onChangeRight} checked={checkedRight} disabled={disableRight}>
        {t("component.settingsBar.rightColumn")}
      </EduCheckBox>
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
