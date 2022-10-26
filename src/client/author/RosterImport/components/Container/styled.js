import styled from 'styled-components'
import { Upload } from 'antd'
import {
  themeColor,
  greyThemeLight,
  lightGrey4,
  lightGrey,
} from '@edulastic/colors'
import { RadioBtn } from '@edulastic/common/src/components/RadioButton'
import { IconInfo } from '@edulastic/icons'
import {
  StyledLayout,
  SettingsWrapper,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import { SpinContainer } from '../../../../admin/Common/StyledComponents'

const { Dragger } = Upload

export const Container = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-botton: 30px;
`

export const RosterDataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 50px 0px;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`
export const StyledHeading1 = styled.h3`
  font-size: 18px !important;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 5px;
  text-align: left;
`
export const StyledSpan = styled.div`
  padding: 10px 10px;
  border-radius: 4px;
  background: ${lightGrey4};
  display: flex;
  font-size: 11px;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 2px;
  margin-bottom: 2px;
  width: 30%;
  min-width: 400px;
`

export const CustomUploadStyledLayout = styled(StyledLayout)`
  width: 100%;
  margin-top: 25px;
  min-height: 250px;
  background: ${lightGrey};
  border: ${({ isDragging }) =>
    isDragging ? `3px dashed ${themeColor}` : `3px dashed ${greyThemeLight}`};
`

export const CustomHistoryStyledLayout = styled(StyledLayout)`
  width: 100%;
  padding: 30px 0px;
  margin-top: 25px;
`

export const InfoIcon = styled(IconInfo)`
  width: 12px;
  height: 12px;
  cursor: pointer;
`

export const UploadDragger = styled(Dragger)`
  &.ant-upload-drag-container {
    /* cursor: auto; */
    padding: 0;
    margin: 0;
  }
  &.ant-upload.ant-upload-drag {
    background: transparent;
    padding: 0;
    margin: 0;
    height: 100%;
    cursor: auto;
  }
  &.ant-upload.ant-upload-drag .ant-upload-btn {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
`
export const StyledSpincontainer = styled(SpinContainer)`
  top: 150px;
`
export const CustomSettingsWrapper = styled(SettingsWrapper)``
export const CustomRadioBtn = styled(RadioBtn)`
  &.ant-radio-disabled {
    &:after {
      border-color: ${greyThemeLight};
    }
    .ant-radio-inner {
      border-color: ${greyThemeLight};
      &:after {
        background-color: ${greyThemeLight};
      }
    }
  }
`
