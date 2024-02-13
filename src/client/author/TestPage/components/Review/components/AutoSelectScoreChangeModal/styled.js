import styled from 'styled-components'

import { black, title } from '@edulastic/colors'

import { IconClose } from '@edulastic/icons'

export const ModalContent = styled.div`
  display: block;
  width: 100%;
  height: 85px;
  margin-top: 0px;
  margin-bottom: 32px;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    max-width: 80%;
    height: auto;
  }
`

export const ModalHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${black};
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
`

export const CloseIcon = styled(IconClose)`
  fill: ${title} !important;
`

export const ModalFooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
`

export const StyledInfoMessage = styled.div`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  margin-top: 25px;
`

export const StyledInfoMessageStrong = styled.span`
  font-weight: 800;
`
