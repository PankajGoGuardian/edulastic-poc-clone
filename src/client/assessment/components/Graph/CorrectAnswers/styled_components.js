import styled from "styled-components";
import { lightGrey, tabletWidth } from "@edulastic/colors";

import { TextField } from "@edulastic/common";

export const Header = styled.div`
  top: 0;
  left: 0;
  height: 40px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 15px;

  span {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;

export const PointField = styled(TextField)`
  width: 170px;
  max-height: 40px;
  min-height: 40px;
  line-height: 40px;
  padding: 0 15px;
  margin-right: 25px;
  border: 1px solid #e1e1e1;
`;
