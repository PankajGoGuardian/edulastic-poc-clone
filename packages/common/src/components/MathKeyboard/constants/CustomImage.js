import styled from 'styled-components'

export const CustomImage = styled.img.attrs({
  className: 'keyboardButton',
  draggable: false,
  role: 'presentation',
})`
  width: ${({ width }) => (width ? `${width}px` : '32px')};
  height: ${({ height }) => (height ? `${height}px` : '32px')};
  object-fit: contain;
`
