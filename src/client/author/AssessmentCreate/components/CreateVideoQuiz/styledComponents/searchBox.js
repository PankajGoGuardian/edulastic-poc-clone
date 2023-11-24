import { white } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { Form, Input } from 'antd'
import styled from 'styled-components'
import YtSearchBackground from '../../../../src/assets/YtSearchBackground.png'

const { Search } = Input

// Following values are in pixel
const searchBoxHeight = 168
const footerFontSize = 12
const switchRightTextFontSize = 10
const switchLeftTextFontSize = 14
const inputFontSize = 16

export const SearchBoxBody = styled.div`
  background-image: url(${YtSearchBackground});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  height: ${`${searchBoxHeight}px`}; // Fix height for search box container
`

export const SearchBoxContainer = styled.div`
  border-radius: 8px;
  border: 1px solid #eee;
  background: #f9f9f9;
  width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const SearchBoxFooter = styled(FlexContainer)`
  padding: 12px 0 12px 0;
  background: ${white};
  border-radius: 0px 0px 8px 8px;
  border-top: 1px solid #eee;
  background: #fff;
  width: 100%;
`
export const FooterText = styled.span`
  color: #555;
  font-family: Open Sans;
  font-size: ${`${footerFontSize}px`};
  font-style: normal;
  font-weight: 400;
  line-height: ${`${footerFontSize * 1.66667}px`}; ;
`

export const IconWrapper = styled(FlexContainer)`
  align-items: center;
`
export const FooterWrapper = styled(FlexContainer)`
  margin-left: 32px;
  align-items: center;
`

export const SearchInput = styled(Search)`
  border: none;
  .ant-input {
    color:  #000
    font-family: Open Sans;
    font-size:  ${`${inputFontSize}px`};
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    height: auto;
    border-width: 2px;
    height: ${`${inputFontSize * 3}px`};
  } 
  .ant-input-affix-wrapper .ant-input:not(:first-child){
    padding-left: 38px;
  }
  .ant-input-group-addon{
    height: 48px;
  }
   .ant-btn-primary{
    height: 48px;
   }
   .ant-btn{
    font-size: 20px;
   }
   .ant-input-clear-icon{
    font-size:20px;
   }
`
export const StyledSwitchText = styled.span`
  color: #777;
  font-family: Open Sans;
  font-size: ${`${switchRightTextFontSize}px`};
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: ${`-${switchRightTextFontSize / 100}px`};
`
export const SafeSearchText = styled.span`
  color: #777;
  font-family: Open Sans;
  font-size: ${`${switchLeftTextFontSize}px`};
  font-style: normal;
  font-weight: 600;
  line-height: ${`${switchLeftTextFontSize * 1.71429}px`};
  letter-spacing: ${`-${switchLeftTextFontSize / 100}px`};
`

export const SearchBoxWrapper = styled(FlexContainer)`
  position: sticky;
  top: 61px; // exact height of breadcrumb component
  z-index: 1;
  background: ${white};
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
