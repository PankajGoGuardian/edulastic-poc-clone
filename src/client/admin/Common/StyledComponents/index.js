import { IconHeader, IconLogoCompact } from "@edulastic/icons";
import styled from "styled-components";
import { Table as AntdTable } from "antd";

export const Logo = styled(IconHeader)`
  width: 119px;
  height: 21px;
`;

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: 14px 0 9px 19px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

export const Button = styled.button`
  ${props =>
    props.noStyle &&
    `
    background:none;
    border:none;
    border:0;
    border-radius:0
  `}
  opacity: ${props => (props.disabled ? "0.2" : "1")};
  cursor: pointer;
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const FlexColumn = styled(FlexDiv)`
  flex-direction: column;
`;

export const MainDiv = styled.div`
  padding: 15px;
  width: 100%;
`;

export const FirstDiv = styled(FlexDiv)`
  margin: 15px;
`;

export const Table = styled(AntdTable)`
  .ant-table table {
    table-layout: fixed;
    word-break: break-word;
  }
`;

export const H2 = styled.h2`
  background-color: #1ab394;
  border-color: #1ab394;
  color: #fff;
  padding: 15px;
`;

export const OuterDiv = styled.div`
  border: 1px solid #1ab394;
  background: #fff;
  margin-bottom: 20px;
`;
