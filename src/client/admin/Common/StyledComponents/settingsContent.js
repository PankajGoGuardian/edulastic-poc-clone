import {
  extraDesktopWidth,
  mobileWidthMax,
  textColor,
  themeColor,
  title,
} from '@edulastic/colors'
import { EduButton, FieldLabel, RadioGrp } from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import styled from 'styled-components'

export const SettingsWrapper = styled.div`
  .manage-district-headerLeft {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`

export const StyledContent = styled.div`
  width: 100%;
  padding: 30px;
`

export const StyledLayout = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: ${(props) => (props.loading === 'true' ? 'none' : 'auto')}
  min-height: 400px;
`

export const ContentWrapper = styled.div`
  width: 100%;
  padding: 30px 15px;
  .ant-form {
    width: 100%;
  }
`
export const StyledRow = styled(Row)`
  margin-bottom: ${(props) => props.mb || '25px'};
  margin-top: ${(props) => props.mt || '0px'};
  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 15px;
  }
`
export const StyledCol = styled(Col)`
  margin-bottom: ${(props) => props.mb || '0px'};
  margin-top: ${(props) => props.mt || '0px'};
  @media (max-width: ${mobileWidthMax}) {
    margin-top: 15px;
  }
`

export const StyledHeading1 = styled.h3`
  font-size: 16px !important;
  color: ${title};
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 15px;
`

export const InputLabel = styled(FieldLabel)`
  font-size: 10px !important;
`
export const StyledRadioGrp = styled(RadioGrp)`
  display: flex;
  flex-direction: ${(props) => props.fd || 'row'};
  min-height: 32px;
  .ant-radio-wrapper {
    margin: 10px 10px 10px 0px;
    align-items: center;
    display: flex;
    @media (max-width: 1599px) {
      .ant-radio {
        & + span {
          font-size: 10px;
          line-height: 1;
          font-weight: 600;
        }
        .ant-radio-inner {
          width: 14px;
          height: 14px;
          &:after {
            top: 2px;
            left: 2px;
          }
        }
      }
    }
  }
`

export const SaveButton = styled(EduButton)`
  min-width: 85px;
  margin-left: auto;
`

export const StyledElementDiv = styled.div`
  display: flex;
  flex-direction: column;

  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }

  .ant-checkbox-wrapper {
    margin-bottom: 15px;
    .ant-checkbox + span {
      font-size: 11px;
      @media (min-width: ${extraDesktopWidth}) {
        font-size: 12px;
      }
    }
  }
`

export const StyledFormItem = styled(Form.Item)`
  margin: 0px;
`

export const HelperText = styled.p`
  line-height: 20px;
  font-size: 10px;
  color: ${textColor};
  @media (min-width: ${extraDesktopWidth}) {
    font-size: 11px;
  }
`
export const ConfigureButton = styled.span`
  color: ${themeColor};
  cursor: pointer;
  margin-left: 5px;
`
