import styled from "styled-components";
import { Paper } from "@edulastic/common";
import { mobileWidth, mainBgColor, white, themeColor } from "@edulastic/colors";
import { Layout, Spin, Button } from "antd";
import { StyledTable } from "../../../common/styled";
import PreviewModal from "../../../author/src/components/common/PreviewModal";

export const Container = styled(Paper)`
  width: 100%;
  margin-bottom: 20px;
  background: ${props => props.theme.questionMetadata.containerBackground};
  box-shadow: none;

  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const StyledLayout = styled(Layout)`
  background: ${mainBgColor};
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;

export const StyledAuditTable = styled(StyledTable)`
  .ant-table {
    border-radius: 10px;
    min-height: 700px;
    background: ${white};
    padding: 16px;
    &-placeholder {
      border-bottom: none;
    }
    tbody {
      tr {
        background: ${white};
      }
    }
  }
`;

export const StyledButton = styled(Button)`
  color: ${themeColor};
  text-transform: uppercase;
  font-size: 11px;
  border-color: ${themeColor};
  padding: 0 30px;
  &:hover {
    color: ${themeColor};
  }
`;

export const StyledPreviewModal = styled(PreviewModal)`
  pointer-events: none;
`;
