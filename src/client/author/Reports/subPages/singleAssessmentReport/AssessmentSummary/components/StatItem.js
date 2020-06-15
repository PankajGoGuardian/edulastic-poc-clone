import React from "react";
import styled from "styled-components";
import { Col } from "antd";
import { greyish, title, themeColorLighter } from "@edulastic/colors";

const StatItem = ({ heading, value, fontSize }) => (
  <StyledCol fontSize={fontSize}>
    <div>
      <p className="stats-title">{heading}</p>
      <p className="stats-value">
        <span className="stats-value-big">{value}</span>
      </p>
    </div>
  </StyledCol>
);

export default StatItem;

const StyledCol = styled(Col)`
  flex: 1 1 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  white-space: pre-wrap;

  & > div {
    background-color: ${greyish};
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 30px;
    display: flex;
    align-items: center;

    @media print {
      background-color: ${greyish};
      -webkit-print-color-adjust: exact;
    }
  }

  .stats-title {
    font-size: ${props => props.fontSize || "16px"};
    font-weight: 600;
    display: block;
    flex: 1 1 auto;
    color: ${title};
  }
  .stats-value {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    justify-content: flex-end;

    .stats-value-big {
      font-size: 25px;
      font-weight: 900;
      color: ${themeColorLighter};
    }
    .stats-value-small {
      font-size: 17px;
    }
  }
`;
