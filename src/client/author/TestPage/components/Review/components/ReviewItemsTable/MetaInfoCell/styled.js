import styled from "styled-components";
import { Tag } from "antd";

import { greenDark, greyDarken, lightGrey } from "@edulastic/colors";

export const FirstText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${greenDark};
`;

export const SecondText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

export const CategoryTitle = styled.span`
  font-size: 13px;
  color: #444444;
`;

export const TypeContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 15px;
`;

export const MetaTag = styled(Tag)`
  background: ${lightGrey};
  border: none;
  color: ${greyDarken};
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;

  &:first-child {
    margin-left: 55px;
  }
`;

export const ExtraInfo = styled.span`
  font-weight: 800;
  color: #bbbfc4;
`;
