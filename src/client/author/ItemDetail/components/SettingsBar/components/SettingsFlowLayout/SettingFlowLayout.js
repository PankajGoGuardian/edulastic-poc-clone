import React from "react";
import { FlexContainer } from "@edulastic/common";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Container, Heading } from "./styled";
import { EduCheckBox } from "@edulastic/common";

const SettingFlowLayout = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t, disableRight }) => (
  <Container>
    <Heading>{t("component.settingsBar.flowLayout")}</Heading>
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
