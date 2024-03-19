import styled from 'styled-components'

export const FOOTER_HEIGHT = 64

export const FooterContainer = styled.div`
  height: ${FOOTER_HEIGHT}px;
  position: fixed;
  bottom: 0px;
  display: flex;
  align-items: center;
  width: 100%;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.04);
`

export const ButtonContainer = styled.div`
  position: absolute;
  right: 10rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;

  button {
    border-radius: 2px;
  }
`

export const EduButtonContainer = styled.div`
  position: relative;
`

export const CoverDiv = styled.div`
  position: absolute;
  width: ${({ cover }) => (cover ? 100 : 0)}%;
  height: ${({ cover }) => (cover ? 100 : 0)}%;
`
