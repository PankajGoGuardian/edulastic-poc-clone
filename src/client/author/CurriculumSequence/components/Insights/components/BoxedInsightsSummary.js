import React from "react";
import styled from "styled-components";
import { Row, Col, Card, Avatar } from "antd";

import {
  white,
  lightGrey8,
  greyThemeDark1,
  fadedGreen,
  themeColorLighter,
  darkOrange,
  fadedRed,
  darkRed
} from "@edulastic/colors";

const colorMap = {
  Exceeding: {
    color: themeColorLighter,
    backgroundColor: fadedGreen
  },
  Meeting: {
    color: darkOrange,
    backgroundColor: "#fde6ce"
  },
  "At Risk": {
    color: darkRed,
    backgroundColor: fadedRed
  }
};

const BoxedInsightsSummary = ({ data }) => {
  return (
    <StyledCol span={24}>
      {data.map(({ label, count }) => (
        <StyledCard>
          <Row type="flex" justify="center" align="middle">
            <StyledCol span={24} justify="space-between" align="center" margin="0 0 0 -5px">
              <Avatar size={35} style={colorMap[label]}>
                {label[0]}
              </Avatar>
              <StyledSpan color={colorMap[label].color}>{count}</StyledSpan>
            </StyledCol>
            <StyledCol span={24} margin="15px 0">
              {label}
            </StyledCol>
          </Row>
        </StyledCard>
      ))}
    </StyledCol>
  );
};

export default BoxedInsightsSummary;

const StyledCol = styled(Col)`
  display: flex;
  align-items: ${props => props.align};
  justify-content: ${props => props.justify || "center"};
  margin: ${props => props.margin};
  font: Bold 14px/19px Open Sans;
  color: ${greyThemeDark1};
`;

const StyledCard = styled(Card)`
  height: 118px;
  width: 118px;
  margin: 4px;
  background: ${white};
  border-radius: 10px;
  border: 1px solid ${lightGrey8};
  opacity: 1;
`;

const StyledSpan = styled.span`
  font: Bold 24px/33px Open Sans;
  color: ${props => props.color};
`;
