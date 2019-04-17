import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Col } from "antd";
import { white, fadedGrey } from "@edulastic/colors";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";

export const CustomizedHeaderWrapper = ({
  breadcrumbsData,
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
      <HeaderTitle>
        {title !== "Reports" ? <Breadcrumb data={breadcrumbsData} style={{ position: "unset" }} /> : null}
      </HeaderTitle>
      <StyledCol>
        {onShareClickCB ? (
          <StyledButton shape="round" size="medium" icon="share-alt" onClick={_onShareClickCB}>
            Share
          </StyledButton>
        ) : null}
        {onPrintClickCB ? (
          <StyledButton shape="round" size="medium" icon="printer" onClick={_onPrintClickCB}>
            Print
          </StyledButton>
        ) : null}
        {onDownloadCSVClickCB ? (
          <StyledButton type="primary" shape="round" size="medium" icon="download" onClick={_onDownloadCSVClickCB}>
            Download CSV
          </StyledButton>
        ) : null}
        {onRefineResultsCB ? (
          <StyledButton
            type={refineButtonActive ? "default" : "primary"}
            shape="round"
            size="medium"
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
  text-align: right;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  font-size: 14px;
`;

const HeaderTitle = styled.div`
  .ant-breadcrumb {
    .ant-breadcrumb-link {
      color: ${white};
      a {
        color: ${white};
      }
    }
    .ant-breadcrumb-separator {
      font-weight: normal;
      color: ${fadedGrey};
    }
  }
`;
