import { SelectInputStyled } from '@edulastic/common'
import styled from 'styled-components'
import { MAX_TAG_WIDTH } from '../../StudentProgressProfile/utils'

export const StyledSelectInput = styled(SelectInputStyled)`
  &.ant-select {
    height: 32px;
    display: flex;
    align-items: center;
    .ant-select-selection {
      display: block;
      overflow: hidden;
      &.ant-select-selection--multiple {
        .ant-select-selection__rendered .ant-select-selection__choice {
          height: 20px;
          max-width: ${MAX_TAG_WIDTH}px;
          @media print {
            max-width: fit-content;
          }
        }
      }
    }
    @media print {
      height: fit-content;
    }
  }
`
