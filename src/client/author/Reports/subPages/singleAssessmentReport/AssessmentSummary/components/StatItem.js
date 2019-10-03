import React from "react";
import styled from "styled-components";
import { Col } from "antd";
import { greyish, title, themeColorLighter } from "@edulastic/colors";

const StatItem = ({ heading, value }) => {
  return (
    <StyledCol>
      <p className="stats-title">{heading}</p>
      <p className="stats-value">
        <span className="stats-value-big">{value}</span>
      </p>
    </StyledCol>
  );
};

export default StatItem;

const StyledCol = styled(Col)`
  padding: 10px 25px;
  flex: 1 1 50%;
  background-color: ${greyish};
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 5px;

  .stats-title {
    font-size: 17px;
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
      font-size: 35px;
      font-weight: 900;
      color: ${themeColorLighter};
    }
    .stats-value-small {
      font-size: 25px;
    }
  }
`;
