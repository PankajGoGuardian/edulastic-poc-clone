import styled from 'styled-components'

export const ClickToSelectContainer = styled.div`
  position: ${({ isShowAnswer }) => !isShowAnswer && 'absolute'};
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  min-width: ${({ width }) => `${width}px`};
  display: flex;
  flex-direction: column;
  min-height: 146px;
  ${({ isShowAnswer }) => isShowAnswer && `margin: 0 15px 5px 0`}
`

export const ElementContainerWrapper = styled.div`
  border: 3px dashed rgb(133, 133, 133);
  min-height: ${({ minHeight }) => `${minHeight}px`};
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(2, minmax(70px, auto));
  grid-gap: 5px;
  background-color: ${({ bgColor }) => bgColor};
`

export const BorderedContainer = styled.div`
  border-color: rgb(133, 133, 133);
  border-width: ${({ borderWidth }) => borderWidth || '1px'};
  border-style: ${({ borderStyle }) => borderStyle || 'solid'};
  display: flex;
  flex-direction: column;
  min-height: 70px;
  cursor: ${({ cursor }) => cursor};
  align-items: ${({ alignItems }) => alignItems};
  padding: ${({ padding }) => padding};
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin: ${({ margin }) => margin};
`
