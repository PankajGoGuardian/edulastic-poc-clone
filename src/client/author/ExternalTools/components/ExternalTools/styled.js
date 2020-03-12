import { Input, List, Row, Col } from "antd";
import styled from "styled-components";
import { themeColor, placeholderGray, backgrounds } from "@edulastic/colors";

export const ExternalToolsSearchHeader = styled.div`
  display: flex;
  padding: 30px;
  background: white;
  margin-bottom: 20px;
  border-radius: 8px;
`;

export const StyledSearch = styled(Input.Search)`
  height: 40px;
  input {
    padding-left: 15px;
    background: ${backgrounds.primary};
    border-radius: 2px;
    &:placeholder {
      color: ${placeholderGray};
    }
    &:focus,
    &:active,
    &:hover {
      & + span {
        svg {
          fill: ${themeColor};
        }
      }
    }
  }
`;

export const StyledList = styled(List)`
  padding: 0px 30px;
`;

export const StyledRow = styled(Row)`
  display: flex;
  align-items: center;
`;

export const StyledColRight = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;
