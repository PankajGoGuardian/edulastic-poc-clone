import { darkGrey2, lightBlue7, title } from '@edulastic/colors'
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
  }
`
export const AddonList = styled.div`
  margin-top: 40px;
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-checked) {
    & + .priceCol {
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
