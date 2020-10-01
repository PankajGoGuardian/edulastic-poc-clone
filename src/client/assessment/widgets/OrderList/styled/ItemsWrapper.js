import styled from 'styled-components'

export const ItemsWrapper = styled.div`
  display: ${(props) => (props.styleType === 'inline' ? 'grid' : 'block')};
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  grid-gap: 10px;
`
