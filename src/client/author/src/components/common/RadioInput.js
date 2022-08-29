import styled from 'styled-components'

export const RadioInputWrapper = styled.div`
  .ant-radio-wrapper:hover .ant-radio-inner,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: ${(props) => props.theme?.checkbox?.checkboxCheckedColor};
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: ${(props) => props.theme?.checkbox?.checkboxCheckedColor};
    &:after {
      background-color: ${(props) =>
        props.theme?.checkbox?.checkboxCheckedColor};
    }
  }
`
