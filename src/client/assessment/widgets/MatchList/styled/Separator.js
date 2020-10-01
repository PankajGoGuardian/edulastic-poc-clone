import styled from 'styled-components'

export const Separator = styled.div`
  max-width: ${({ smallSize }) => (smallSize ? 22 : 46)}px;
  width: 100%;
  height: 0;
  position: relative;
  display: block;
  margin: 0px 10px;
  border: 1px solid
    ${({ correctAnswer, theme }) =>
      correctAnswer
        ? theme.widgets.matchList.correctAnswerBlockSeparatorBorderColor
        : theme.widgets.matchList.separatorBorderColor};

  &:after {
    content: '';
    position: absolute;
    right: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${(props) => props.theme.widgets.matchList.separatorBgColor};
    display: block;
    border-radius: 50%;
  }

  &:before {
    content: '';
    position: absolute;
    left: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${(props) => props.theme.widgets.matchList.separatorBgColor};
    display: block;
    border-radius: 50%;
  }
`
