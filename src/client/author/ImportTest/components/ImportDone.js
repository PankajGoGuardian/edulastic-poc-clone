import React from "react";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";

import { List } from "antd";
import { FlexContainer, StyledButton } from "./styled";
import TitleWrapper from "../../AssignmentCreate/common/TitleWrapper";

const ImportDone = ({ t }) => {
  const ContinueBtn = (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px"
      }}
    >
      <StyledButton onClick={() => alert("reset the status and redirect as required")}>
        Continue
      </StyledButton>
    </div>
  );
  return (
    <FlexContainer flexDirection="column" width="65%">
      <TitleWrapper>{t("qtiimport.done.title")}</TitleWrapper>
      <List itemLayout="horizontal" loadMore={ContinueBtn}>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions imported</div>
            <div>20</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions skipped due to unsupported type</div>
            <div>3</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions skipped due to incomplete question content</div>
            <div>3</div>
          </FlexContainer>
        </List.Item>
      </List>
    </FlexContainer>
  );
};

ImportDone.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces("qtiimport")(ImportDone);
