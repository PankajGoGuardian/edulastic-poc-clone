import styled from 'styled-components'
import {
  greyThemeDark2,
  greyThemeLighter,
  greyThemeLight,
  themeColorBlue,
  greyThemeDark4,
  backgroundGrey,
  black,
} from '@edulastic/colors'
import {
  SelectInputStyled,
  DatePickerStyled,
  FieldLabel,
} from '@edulastic/common'

export const StyledFormTitle = styled.div`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
`
export const StyledNavContainer = styled.div`
  position: fixed;
  width: 230px;
  height: 100%;
`

export const StyledNav = styled.div`
  border: 1px solid #bbbbbb;
  border-radius: 17px;
  width: 100%;
  height: 318px;
  margin-top: 26px;
`

export const StyledFormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60vh;
  overflow: auto;
  width: 100%;
`

export const StyledNavWrapper = styled.div`
  position: relative;
  width: 270px;
`

export const StyledFormContainer = styled.div`
  width: calc(100% - 270px);
  display: flex;
  flex-direction: column;
  box-shadow: none;
`
export const StyledDropDown = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    display: initial;
    color: ${greyThemeDark2};
  }
`

export const SelectWrapper = styled.div`
  width: 90%;
  .ant-select {
    width: 100%;
    min-height: 40px;
    .ant-select-selection {
      background: ${greyThemeLighter};
      border-radius: 2px;
      border: 1px solid ${greyThemeLight};
      :hover {
        border-color: ${themeColorBlue};
        box-shadow: none;
      }
    }
    &.ant-select-focused {
      .ant-select-selection {
        border-color: ${themeColorBlue};
        box-shadow: none;
      }
    }
  }
  input {
    height: 40px;
    background: ${greyThemeLighter};
    border-radius: 2px;
  }
`
export const StyledDatePicker = styled(DatePickerStyled)`
  width: 100%;
`
export const StyledFilterLabel = styled(FieldLabel)`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 14px;
  color: ${greyThemeDark4};
`

export const StyledTitle = styled.div`
  height: 16px;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 16px;
  color: ${greyThemeDark4};
`

export const StyledSectionDescription = styled.div`
  width: 100%;
  background-color: ${backgroundGrey};
  border-radius: 5px;
  padding-left: 10px;
  margin-bottom: 15px;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 33px;
  color: ${black};
`
