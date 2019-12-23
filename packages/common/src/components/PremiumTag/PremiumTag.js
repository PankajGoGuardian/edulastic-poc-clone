import React from "react";
import { Tag } from "antd";
import styled from "styled-components";
import { lightGrey, greyDarken, themeLightGrayBgColor } from "@edulastic/colors";

const PremiumTag = () => <TagPremium>PREMIUM</TagPremium>;

export default PremiumTag;

const TagPremium = styled(Tag)`
  background: ${themeLightGrayBgColor};
  color: ${greyDarken};
  border: none;
  font-weight: 700;
  font-size: 10px;
  margin-right: 3px;
  padding: 4px 10px;
`;
