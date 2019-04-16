import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Col } from "antd";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import { Title } from "../../../src/components/common/ListHeader";

export const CustomizedHeaderWrapper = ({
  title,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  onRefineResultsCB
}) => {
  const [refineButtonActive, setRefineButtonActive] = useState(false);

  const _onShareClickCB = () => {
    onShareClickCB();
  };

  const _onPrintClickCB = () => {
    onPrintClickCB();
  };

  const _onDownloadCSVClickCB = () => {
    onDownloadCSVClickCB();
  };

  const _onRefineResultsCB = event => {
    setRefineButtonActive(!refineButtonActive);
    onRefineResultsCB(event, !refineButtonActive);
  };

  return (
    <HeaderWrapper>
      <Title>{title}</Title>
      <StyledCol>
        {onShareClickCB ? (
          <StyledButton shape="round" size="large" icon="share-alt" onClick={_onShareClickCB}>
            Share
          </StyledButton>
        ) : null}
        {onPrintClickCB ? (
          <StyledButton shape="round" size="large" onClick={_onPrintClickCB}>
            Print
          </StyledButton>
        ) : null}
        {onDownloadCSVClickCB ? (
          <StyledButton type="primary" shape="round" size="large" onClick={_onDownloadCSVClickCB}>
            Download CSV
          </StyledButton>
        ) : null}
        {onRefineResultsCB ? (
          <StyledButton
            type={refineButtonActive ? "default" : "primary"}
            shape="round"
            size="large"
            icon="filter"
            onClick={_onRefineResultsCB}
          >
            Refine results
          </StyledButton>
        ) : null}
      </StyledCol>
    </HeaderWrapper>
  );
};

const StyledCol = styled(Col)`
  flex: 1;
  text-align: right;
`;

const StyledButton = styled(Button)`
  margin: 0 5px;
`;

// #18a67d
