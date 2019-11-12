import React from "react";
import { Tag } from "antd";
import styled from "styled-components";
import { smallDesktopWidth } from "@edulastic/colors";

const PremiumTag = () => (
  <TagPremium>
    <Tag color={"#FFA200"}>$</Tag>
    <span>PREMIUM</span>
  </TagPremium>
);

export default PremiumTag;

const TagPremium = styled(Tag)`
  background: #fce7c1;
  border-color: #fce7c1;
  color: #cf8400;
  padding-left: 0px;
  font-weight: 800;
  margin: 0px;

  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px;
    span {
      display: none;
    }
    .ant-tag {
      margin: 0px;
    }
  }
`;
