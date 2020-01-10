import styled from "styled-components";
import { Row, Radio } from "antd";
import {
  boxShadowDefault,
  white,
  themeColor,
  linkColor1,
  borderGrey,
  lightGreySecondary,
  themeColorTagsBg
} from "@edulastic/colors";

export const Container = styled.div``;

export const BreadcrumbContainer = styled(Row)`
  margin-left: 40px;
  margin-top: 15px;
`;

export const CreateGroupWrapper = styled.div`
  width: 80%;
  background: ${white};
  margin: auto;
  padding: 40px 80px;
  margin-top: 50px;
  box-shadow: ${boxShadowDefault};
  border-radius: 8px;
`;

export const Heading = styled.div`
  font-size: ${props => props.theme.keyboardFontSize};
  font-weight: ${props => props.theme.semiBold};
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;
`;

export const ContentBody = styled.div``;

export const GroupField = styled.div`
  margin-bottom: 30px;
  input {
    height: 40px;
  }
  .ant-checkbox-wrapper {
    font-size: ${props => props.theme.smallFontSize};
    text-transform: uppercase;
    font-weight: ${props => props.theme.semiBold};
    .ant-checkbox {
      margin-right: 10px;
    }
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ fontWeight }) => (fontWeight ? "0px" : "5px")};
  font-size: ${({ fontWeight, theme }) => (fontWeight ? theme.standardFont : theme.smallFontSize)};
  text-transform: uppercase;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : "500")};
  cursor: ${({ fontWeight }) => (fontWeight ? "pointer" : "default")};
`;

export const RadioGroup = styled(Radio.Group)`
  display: block;
  .ant-radio-wrapper {
    display: inline-flex;
    align-items: center;
    .ant-radio {
      margin-right: 10px;
    }
    > span:last-child {
      font-weight: ${props => props.theme.semiBold};
      text-transform: uppercase;
      ${props => props.theme.smallFontSize};
    }
  }
`;

export const ItemCountWrapper = styled.div`
  display: inline;
  > input {
    width: 70px;
    margin: 0px 5px;
    height: 30px;
  }
`;

export const AddGroupButton = styled.span`
  text-transform: uppercase;
  color: ${white};
  background: ${themeColor};
  display: inline-block;
  padding: 10px 30px;
  font-size: ${props => props.theme.commentFontSize};
  border-radius: 4px;
  cursor: pointer;
  box-shadow: ${boxShadowDefault};
  transition: all 0.3s ease-in-out;
  border: 1px solid ${themeColor};
  margin-top: 10px;
  &:hover {
    color: ${themeColor};
    background: ${white};
  }
`;

export const RadioMessage = styled.div`
  margin: 5px 0px 20px 35px;
  font-size: ${props => props.theme.smallFontSize};
  color: ${linkColor1};
`;

export const SelectItemsButton = styled(AddGroupButton)`
  color: ${themeColor};
  background: ${white};
  height: 40px;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: unset;
  margin-top: 0px;
  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`;

export const QuestionTagsWrapper = styled.div`
  display: flex;
`;

export const QuestionTagsContainer = styled.div`
  width: 510px;
  margin-right: 30px;
  display: inline-block;
  min-height: 40px;
  border: 1px solid ${borderGrey};
  border-radius: 2px;
  padding: 3px 8px 8px 3px;
`;

export const SelectWrapper = styled.div`
  width: ${({ width }) => width};
  display: inline-block;
  margin-right: 10px;
  .ant-select {
    width: 100%;
    height: 40px;
    .ant-select-selection {
      background: ${lightGreySecondary};
      border-radius: 2px;
    }
  }
  input {
    height: 40px;
    background: ${lightGreySecondary};
    border-radius: 2px;
  }
`;

export const AutoSelectFields = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
`;

export const DoneButton = styled(AddGroupButton)`
  margin: auto;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;

export const ItemTag = styled.span`
  background: ${themeColorTagsBg};
  color: ${themeColor};
  border-radius: 4px;
  padding: 1px 6px;
  font-size: ${props => props.theme.smallFontSize};
  display: inline-block;
  margin: 5px 0px 0px 5px;
  font-weight: ${props => props.theme.semiBold};
`;
