import {
  darkGrey4,
  fieldRequiredColor,
  smallDesktopWidth,
  themeColor,
  white,
  aiLinearGradient,
} from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  FlexContainer,
} from '@edulastic/common'

import { Form } from 'antd'
import styled from 'styled-components'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import { STATUS } from './ducks/constants'

export const FormWrapper = styled(Form)`
  .ant-row {
    text-align: left;
    padding: 0px;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-transform: uppercase;
      color: #000000;
      &:after {
        display: none;
      }
    }
    .ant-form-item-children {
      .ant-input {
        min-height: 45px;
        margin-top: 10px;
      }
      .remote-autocomplete-dropdown {
        line-height: normal;
        .ant-input-affix-wrapper {
          .ant-input {
            min-height: 45px;
          }
        }
      }
      .ant-select-selection .ant-select-selection__rendered {
        min-height: 45px;
        .ant-select-selection-selected-value {
          margin-top: 7px;
        }
      }
      .ant-select-selection__choice {
        height: 35px !important;
      }
      .ant-select-arrow {
        top: 50% !important;
      }
    }
  }
`

export const StyledFilterLabel = styled(FieldLabel)`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 11px;
  line-height: 14px;
  color: ${darkGrey4};
  margin-top: 2rem;
`

export const StyledRequired = styled.span`
  color: ${fieldRequiredColor};
  margin-left: 3px;
  font-size: 14px;
`

export const AiEduButton = styled(EduButton)`
  font-weight: ${({ fontWeight }) => fontWeight};
  margin-left: 0px !important;

  &.ant-btn.ant-btn-primary {
    border: none;
    background: ${({ aiStyle }) =>
      aiStyle ? `linear-gradient(225deg, ${aiLinearGradient})` : white};
    color: ${({ aiStyle }) => (aiStyle ? white : themeColor)};
    height: ${({ aiStyle }) => aiStyle && '28px'};
    width: '100%';
    margin: ${({ margin }) => margin && '0 5px'};
    border: 'none';
  }
  &:hover {
    &.ant-btn.ant-btn-primary {
      background: ${({ aiStyle }) =>
        aiStyle ? `linear-gradient(225deg, ${aiLinearGradient})` : white};
      color: ${({ aiStyle }) => (aiStyle ? white : themeColor)};
      border: none;
    }
  }
`

export const FullHeightAiEduButton = styled(AiEduButton)`
  &.ant-btn.ant-btn-primary {
    height: ${({ aiStyle }) => aiStyle && '36px'};
    margin: ${({ margin }) => margin && '0 5px !important'};

    @media (max-width: ${smallDesktopWidth}) {
      height: ${({ aiStyle }) => aiStyle && '30px'};
    }
  }
`

export const CreateAiTestTitleWrapper = styled(TitleWrapper)`
  padding: 0;
  margin: 0;
  line-height: 2;
  color: #fff;
  font-size: 1rem;
  text-align: left;
`

export const CreateAiTestWrapper = styled(FlexContainer)`
  border-radius: 10px;
  background: linear-gradient(225deg, ${aiLinearGradient});
`

export const StyledDiv = styled.div`
  width: calc(100% - 2.5rem);
  padding-left: 2rem;
`
export const StyledCreateAiTestModal = styled(CustomModalStyled)`
  .ant-modal-content {
    .ant-modal-close {
      display: ${(props) =>
        props?.aiTestStatus === STATUS.INPROGRESS ? 'none' : 'initial'};
    }
  }
`

export const CreateAiTestBannerWrapper = styled(FlexContainer)`
  border-radius: 12px;
  border: 1px solid #d8d8d8;
  height: 62px;
  background: white;
  width: max-content;
  gap: 1rem;
  padding: 1rem;
`

export const CreateAiTestBannerTitleWrapper = styled(TitleWrapper)`
  padding: 0;
  margin: 0;
  margin-left: -4px;
  font-size: 14px;
  text-align: left;
  heght: min-content;
  background: var(--Linear, linear-gradient(269deg, ${aiLinearGradient}));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
