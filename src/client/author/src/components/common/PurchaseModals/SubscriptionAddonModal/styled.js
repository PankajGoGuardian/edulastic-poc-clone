import { darkGrey2, lightBlue7, title } from '@edulastic/colors'
import { CheckboxLabel } from '@edulastic/common'
import styled from 'styled-components'

export const ModalBody = styled.div`
  font-size: 14px;
  color: ${darkGrey2};
  p {
    font-weight: normal !important;
  }
  a {
    color: ${lightBlue7};
    font-weight: 600;
  }
  .priceCol {
    color: ${title};
    font-weight: 600;
    width: 70px;
    text-align: right;
  }
`
export const AddonList = styled.div`
  margin-top: ${(props) => props.marginTop || '40px'};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  padding-right: ${({ pr }) => pr};
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: ${(props) => props.alignItems || null};
  margin-bottom: 5px;
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-checked) {
    & ~ .priceCol {
      text-decoration: line-through;
      color: ${title};
      opacity: 50%;
    }
  }
`
export const Total = styled.div`
  border-top: 1px solid #dddddd;
  margin-top: 15px;
  padding-top: 15px;
`

export const NumberInputWrapper = styled.div`
  .ant-input-number-input {
    text-align: center;
  }
  .ant-input-number-handler-wrap {
    background: none;
    border: none;
    opacity: 1;
    right: -30px;
    font-size: 18px;
    & .ant-input-number-handler-up-inner,
    & .ant-input-number-handler-down-inner {
      display: none;
    }
    .ant-input-number-handler-up,
    .ant-input-number-handler-down {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px !important;
      top: 4px;
      position: absolute;
      border: none;
      font-weight: 500 !important;
      &:before,
      &:after {
        font-family: 'fontAwesome';
        font-size: 17px;
        color: #878a91;
        font-weight: normal;
      }
      &-disabled {
        opacity: 0.3;
      }
    }
    .ant-input-number-handler-down {
      margin-left: -110px;
      &:before {
        content: '\f056';
      }
    }
    .ant-input-number-handler-up {
      &:after {
        content: '\f055';
      }
    }
  }
`
export const StyledCheckbox = styled(CheckboxLabel)`
  width: 160px;
  &.ant-checkbox-wrapper .ant-checkbox + span {
    color: ${title};
    font-size: ${({ fontSize }) => fontSize};
  }
`

export const StyledDiv = styled.div`
  margin-top: 10px;
`
