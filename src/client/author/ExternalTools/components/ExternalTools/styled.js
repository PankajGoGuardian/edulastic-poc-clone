import { Input, List, Row, Col } from "antd";
import styled from "styled-components";
import { themeColor, white, placeholderGray, backgrounds } from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

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

export const CustomModal = styled(ConfirmationModal)`
  && {
    .ant-modal-content {
      background: ${white};
      .ant-modal-header {
        padding: 0 25px 0 25px;
        background: ${white};
      }
      .ant-modal-body {
        box-shadow: none;
      }
    }
  }
`;
