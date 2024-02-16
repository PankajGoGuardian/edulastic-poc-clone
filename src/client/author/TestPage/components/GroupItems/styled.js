import styled from 'styled-components'
import { Row, Radio, Button, Collapse, Input, Typography } from 'antd'
import {
  boxShadowDefault,
  white,
  themeColor,
  linkColor1,
  borderGrey,
  lightGreySecondary,
  themeColorTagsBg,
} from '@edulastic/colors'

export const Container = styled.div``

export const BreadcrumbContainer = styled(Row)`
  margin-left: 40px;
  margin-top: 15px;
`

export const CreateGroupWrapper = styled.div`
  width: 80%;
  background: ${white};
  margin: auto;
  padding: 40px 80px;
  margin-top: 50px;
`

export const Heading = styled.div`
  font-size: ${(props) => props.theme.keyboardFontSize};
  font-weight: ${(props) => props.theme.semiBold};
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;
  i {
    color: ${themeColor};
    font-size: 18px;
    line-height: 16px;
  }
`

export const ContentBody = styled.div``

export const GroupField = styled.div`
  margin-bottom: ${({ marginBottom }) => marginBottom || '30px'};
  input {
    height: 40px;
  }
  .ant-checkbox-wrapper {
    font-size: ${(props) => props.theme.smallFontSize};
    text-transform: uppercase;
    font-weight: ${(props) => props.theme.semiBold};
    .ant-checkbox {
      margin-right: 10px;
    }
  }
`

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ fontWeight }) => (fontWeight ? '0px' : '5px')};
  font-size: ${({ fontWeight, theme }) =>
    fontWeight ? theme.standardFont : theme.smallFontSize};
  text-transform: uppercase;
  font-weight: ${({ fontWeight }) => fontWeight || '600'};
  cursor: ${({ fontWeight }) => (fontWeight ? 'pointer' : 'default')};
`
export const SectionNameInput = styled(Input)`
  max-width: 400px;
  margin: 10px;
`

export const RadioGroup = styled(Radio.Group)`
  display: block;
  .ant-radio-wrapper {
    display: inline-flex;
    align-items: center;
    .ant-radio {
      margin-right: 10px;
    }
    > span:last-child {
      font-weight: ${(props) => props.theme.semiBold};
      text-transform: uppercase;
      ${(props) => props.theme.smallFontSize};
    }
  }
`

export const ItemCountWrapper = styled.div`
  display: inline;
  > input {
    width: 70px;
    margin: 0px 5px;
    height: 30px;
  }
`

export const AddGroupButton = styled.span`
  text-transform: uppercase;
  color: ${white};
  background: ${themeColor};
  display: inline-block;
  padding: 10px 30px;
  font-size: ${(props) => props.theme.commentFontSize};
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
`

export const RadioMessage = styled.div`
  margin: 5px 0px ${(props) => props.marginBottom || '0px'}
    ${(props) => props.marginLeft || '0px'};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${linkColor1};
`

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
`

export const BrowseButton = styled(SelectItemsButton)`
  box-shadow: unset;
  display: flex;
  width: auto;
  border-radius: 2px;
`

export const QuestionTagsWrapper = styled.div`
  display: flex;
`

export const QuestionTagsContainer = styled.div`
  width: 510px;
  margin-right: 30px;
  display: inline-block;
  min-height: 40px;
  border: 1px solid ${borderGrey};
  border-radius: 2px;
  padding: 3px 8px 8px 3px;
`

export const SelectWrapper = styled.div`
  width: ${({ width }) => width};
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  .ant-select {
    width: 100%;
    min-height: 40px;
    .ant-select-selection {
      background: ${lightGreySecondary};
      border-radius: 2px;
      .ant-select-selection__rendered {
        line-height: 38px;
      }
    }
  }
  input {
    height: 40px;
    background: ${lightGreySecondary};
    border-radius: 2px;
  }
`

export const AutoSelectFields = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
`

export const DoneButton = styled(AddGroupButton)`
  margin: auto;
`

export const ItemTag = styled.span`
  background: ${themeColorTagsBg};
  color: ${themeColor};
  border-radius: 4px;
  padding: 1px 6px;
  font-size: ${(props) => props.theme.smallFontSize};
  display: inline-block;
  margin: 5px 0px 0px 5px;
  font-weight: ${(props) => props.theme.semiBold};
`

export const StandardNameSection = styled.div`
  height: 40px;
  border: 1px solid ${themeColor};
  border-radius: 2px;
  padding: 8px;
  color: ${themeColor};
  background: ${themeColorTagsBg};
  > span:first-child {
    display: inline-block;
    width: 90%;
    text-align: center;
  }
  > span:last-child {
    cursor: pointer;
  }
`

export const PanelStyled = styled(Collapse.Panel)`
  & .ant-collapse-header[role='button'] {
    padding: 0 16px 0 40px;
  }
`

export const PanelHeading = styled.div`
  display: flex;
  justify-content: space-between;
  > div:last-child {
    display: flex;
    align-items: center;
    > div {
      margin-left: 10px;
      padding: 8px;
      font-size: 18px;
      color: ${themeColor};
      svg {
        fill: ${themeColor};
      }
    }
  }
  & > label {
    padding: 12px 0;
  }
`

export const SaveButton = styled(Button)`
  width: 130px;
  height: 35px;
  text-transform: uppercase;
  font-size: 12px;
  color: ${white};
  background: ${themeColor};
  margin-right: 10px;
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`
export const SectionsTestCreateGroupWrapper = styled.div`
  width: 80%;
  background: ${white};
  margin: auto;
  padding: 40px 80px;
`
export const StyledAddSectionsButton = styled.button`
  padding-block: 12px;
  border-radius: 7px;
  border-color: transparent;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 12px;
`

export const StyledInfoMessage = styled(Typography.Paragraph)`
  padding-top: 12px;
`
