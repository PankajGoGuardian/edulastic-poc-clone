import { lightGrey } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { Form, Icon, Input } from 'antd'

const footerFontSize = 12
const inputFontSize = 12
const subHeaderFontSize = 20

export const FooterText = styled.span`
  color: #999;
  font-family: 'Open Sans';
  font-size: ${`${footerFontSize}px`};
  font-style: normal;
  font-weight: 400;
  line-height: ${`${footerFontSize * 1.5}px`};
`
export const VideoStreamingProviders = styled(FlexContainer)`
  padding: 12px 0 12px 0;
  background: transparent;
`

export const SearchInput = styled(Input)`
  border: none;
  .ant-input {
    color: #000;
    font-family: 'Open Sans';
    font-size: ${`${inputFontSize}px`};
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    height: ${`${inputFontSize * 3}px`};
  }
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 38px;
  }
  .ant-input-clear-icon {
    font-size: 16px;
    color: #999999;
  }
`
export const SubHeader = styled.div`
  color: #2f4151;
  font-family: 'Open Sans';
  font-size: ${`${subHeaderFontSize}px`};
  font-style: normal;
  font-weight: 600;
  line-height: ${`${subHeaderFontSize * 1.5}px`};
`
export const StyledForm = styled(Form)`
  &.ant-form {
    width: 100%;
    max-width: 465px;
  }
`
export const StyledSearchBoxContainer = styled(FlexContainer)`
  background: ${lightGrey};
`

export const StyledIcon = styled(Icon)`
  color: #595959;
  font-size: ${({ fontSize }) => fontSize || '16px'};
`
export const FormItem = styled(Form.Item)`
  &.ant-form-item {
    margin: 0px;
  }
  .ant-form-explain {
    position: absolute;
    top: ${`${inputFontSize * 3 + 6}px`};
  }
`

export const FooterWrapper = styled(FlexContainer)`
  margin-left: 32px;
  align-items: center;
`
