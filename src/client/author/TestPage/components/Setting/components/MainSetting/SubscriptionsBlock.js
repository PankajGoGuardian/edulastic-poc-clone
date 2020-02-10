import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";

import { fadedGrey, themeColor, white, secondaryTextColor, greyishBorder } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import styled from "styled-components";

const SubscriptionsBlock = () => (
  <FlexContainer flexDirection="column" padding="40px 0 10px 0">
    <FlexContainer width="100%" style={{ borderBottom: `1px solid ${fadedGrey}` }} padding="0 0 20px 0">
      <FlexContainer flexDirection="column" width="100%" alignItems="flex-start">
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: secondaryTextColor }}>Advanced Options</h2>
        <p style={{ color: greyishBorder, fontSize: 14, fontWeight: "normal" }}>
          Assess with even more options for students.
        </p>
      </FlexContainer>
      <Link to="/author/subscription">
        <UpgradeBtn>Upgrade Now</UpgradeBtn>
      </Link>
    </FlexContainer>
    <FlexContainer width="100%" padding="15px 10px">
      <IconItem>
        <i class="fa fa-random" aria-hidden="true" />
        <p>Shuffle Questions & Choices</p>
      </IconItem>
      <IconItem>
        <i class="fa fa-eye-slash" aria-hidden="true" />
        <p> Hide Answers</p>
      </IconItem>
      <IconItem>
        <i class="fa fa-th-large" aria-hidden="true" />
        <p> Rubric Grading</p>
      </IconItem>
      <IconItem>
        <Icon type="calculator" />
        <p> Show Calculator</p>
      </IconItem>
    </FlexContainer>
  </FlexContainer>
);

export default SubscriptionsBlock;

export const IconItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 400px;
  padding: 20px;
  box-sizing: border-box;

  p {
    width: 120px;
  }

  i {
    font-size: 40px;
    color: ${themeColor};
  }
`;

export const UpgradeBtn = styled.button`
  color: ${white};
  background: ${themeColor};
  border: none;
  outline: none;
  width: 280px;
  border-radius: 4px;
  height: 40px;
  text-transform: uppercase;
  cursor: pointer;
`;
