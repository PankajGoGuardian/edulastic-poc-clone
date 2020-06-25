import React from "react";
import styled from "styled-components";
import { QuestionNumberLabel } from "@edulastic/common";
import { withNamespaces } from "react-i18next";

const ItemInvisible = ({ qLabel, showQuestionNumber, t }) => (
  <div>
    {showQuestionNumber && (
      <div style={{ display: "inline-block" }}>
        <QuestionNumberLabel>{qLabel}</QuestionNumberLabel>
      </div>
    )}
    <InvisibleItemWrapper>{t("common.testHidden")}</InvisibleItemWrapper>
  </div>
);

export default withNamespaces("classBoard")(ItemInvisible);

const InvisibleItemWrapper = styled.div`
  min-height: 40vh;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: center;
`;
