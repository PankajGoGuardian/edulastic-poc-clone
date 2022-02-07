import {
  extraDesktopWidth,
  tabletWidth,
  themeColor,
  white,
} from '@edulastic/colors'
import { TextAreaInputStyled } from '@edulastic/common'
import { Button, Form, Row } from 'antd'
import styled from 'styled-components'

export const StyledFormDiv = styled.div`
  display: flex;
  width: 100%;
  .ant-form {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`

export const HeaderRow = styled(Row)`
  padding: 0px 0px 10px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin: 0px;
    @media only screen and (min-width: ${extraDesktopWidth}) {
      font-size: 20px;
    }
  }
  .hide-label {
    label {
      display: none;
    }
    .ant-form-item {
      margin: 0px;
    }
  }
`

export const StyledDivBg = styled.div`
  width: 360px;
  padding-right: 40px;
`

export const StyledDivMain = styled.div`
  width: 100%;
  background-color: ${white};
  padding: 10px 25px;
  overflow: hidden;
`

export const StyledRow = styled(Row)`
  display: flex;
  flex-direction: row;
`

export const StyledRowLogo = styled(StyledRow)`
  margin-bottom: 30px;
`

export const StyledRowAnn = styled(StyledRow)`
  .ant-form-item {
    min-width: 500px;
  }
`

export const DistrictUrl = styled.p`
  margin-left: 10px;
  line-height: 24px;
  align-self: center;
`

export const StyledTextArea = styled(TextAreaInputStyled)`
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
`

export const SaveButton = styled(Button)`
  margin-left: 220px;
`

export const StyledUrlButton = styled(Button)`
  border: none;
  box-shadow: none;
  padding-right: 0px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.19px;
  display: flex;
  align-items: center;
  margin-left: auto;

  svg {
    margin-right: 10px;
    transform: rotate(180deg);
    fill: ${themeColor};
    &:hover {
      fill: ${themeColor};
    }
  }
  @media only screen and (min-width: ${extraDesktopWidth}) {
    font-size: 12px;
  }
`

export const StyledPopoverContent = styled.div`
  display: flex;
  justify-contents: space-around;
  border: 1px solid #e8e8e8;
  padding: 5px 10px;
`

export const PopoverCloseButton = styled(Button)`
  border: none;
  outline: none;
  box-shadow: none;
  color: #1890ff;
  margin-left: 30px;
`

export const StyledDistrictUrl = styled.p`
  line-height: 32px;
  font-weight: 600;
`

export const FormFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media only screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
    justify-content: space-evently;
  }
`

export const FormColumnLeft = styled.div`
  width: 100%;
`

export const FormColumnRight = styled.div`
  width: 100%;
`

export const ColumnSpacer = styled.div`
  display: block;
  margin: 15px;
  @media only screen and (max-width: ${tabletWidth}) {
    display: none;
  }
`

export const StyledFormItem = styled(Form.Item)`
  height: 200px;
  .ant-input {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .ant-form-item-control-wrapper {
    height: 100%;
    .ant-form-item-control {
      height: 100%;
    }
  }
`

export const EditableLabelDiv = styled.div`
  display: flex;
  flex-direction: column;
  .not-editing-input {
    box-shadow: none;
    caret-color: transparent;
  }
  .not-editing-input:focus {
    box-shadow: none;
  }
  label {
    font-size: 10px;
    @media only screen and (min-width: ${extraDesktopWidth}) {
      font-size: 12px;
    }
  }
`

export const InputWithUrl = styled.div`
  display: flex;
  justify-content: space-between;
`

export const SyncInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`
