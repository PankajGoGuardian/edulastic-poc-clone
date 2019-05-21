import styled from "styled-components";
import { Form, Menu, Input } from "antd";

export const StyledFormItem = styled(Form.Item)`
  margin: 0;
`;

export const ScoreColorSpan = styled.span`
  display: block;
  border: 1px solid #000;
  width: 28px;
  height: 22px;
  background-color: ${props => props.color};
`;

export const ScoreMenuColorSpan = styled(ScoreColorSpan)`
  width: 20px;
  height: 20px;
  border: ${props => (props.isActive ? "1px solid #F0C49B" : "1px solid #D0D0D0")};
`;

export const ScoreSpan = styled.span`
  margin-left: 5px;
`;

export const StyledHiddenInput = styled(Input)`
  display: none;
`;

export const StyledColorMenu = styled(Menu)`
  display: flex;
  border: 1px solid #f0c49b;
  width: 122px;
  padding: 8px;
  flex-wrap: wrap;
  background: #ececec;
  border-radius: 0;

  .ant-dropdown-menu-item {
    padding: 3px;
  }
`;

export const StyledScoreDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 12px;

  .anticon-down {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
    margin-left: 5px;
    margin-right: 4px;
  }
`;
