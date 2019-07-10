import { mobileWidth } from "@edulastic/colors";
import { Select } from "antd";
import styled from "styled-components";

export const AdaptiveSelect = styled(Select)`
  width: 140px;
  margin-top: 10px;

  @media (max-width: ${mobileWidth}) {
    width: 100%;
  }
`;
