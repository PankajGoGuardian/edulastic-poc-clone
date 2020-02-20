import React from "react";
import { withNamespaces } from "@edulastic/localization";
import { Spin } from "antd";
import PropTypes from "prop-types";

import TitleWrapper from "../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../AssignmentCreate/common/TextWrapper";
import { FlexContainer } from "./styled";

const ImportInprogress = ({ t }) => (
  <FlexContainer flexDirection="column" alignItems="column" width="50%">
    <Spin size="large" style={{ top: "40%" }} />
    <TitleWrapper>{t("qtiimport.importinprogress.title")}</TitleWrapper>
    <TextWrapper> {t("qtiimport.importinprogress.description")} </TextWrapper>
  </FlexContainer>
);

ImportInprogress.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces("qtiimport")(ImportInprogress);
