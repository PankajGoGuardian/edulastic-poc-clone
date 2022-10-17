import styled from 'styled-components'
import { Upload } from 'antd'
import {
  StyledLayout,
  SettingsWrapper,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import { SpinContainer } from '../../../../admin/Common/StyledComponents'
import { themeColor, greyThemeLight } from '@edulastic/colors'
const { Dragger } = Upload

export const RosterDataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 25px;
`

export const CustomStyledLayout = styled(StyledLayout)`
  width: 100%;
  border: 3px solid ${greyThemeLight};
  padding: 30px 15px;
  margin-top: 30px;
`

export const CustomSettingsWrapper = styled(SettingsWrapper)``
export const UploadDragger = styled(Dragger)`
  display: flex;
  width: 100%;
  height: 100%;
  &.ant-upload-list {
    display: none;
  }
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
