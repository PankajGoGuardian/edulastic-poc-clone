import { secondaryTextColor } from '@edulastic/colors'
import styled from 'styled-components'

export const ModalWrapper = styled.div`
  width: ${(props) => props.width || '746px'};
  .scrollbar-container {
    padding: 0 15px;
  }
`

export const ModalHeader = styled.div`
  margin-bottom: 30px;
  padding: 0 18px;
`

export const ModalTitle = styled.h2`
  display: inline-block;
  margin: ${(props) => props.margin || '0 0 0 15px'};
  font-size: 22px;
  font-weight: bold;
  color: ${secondaryTextColor};
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.marginTop};
  .ant-btn {
    width: 150px;
  }
`
