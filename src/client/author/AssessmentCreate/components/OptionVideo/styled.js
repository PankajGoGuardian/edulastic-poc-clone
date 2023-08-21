import styled from 'styled-components'

export const SnapQuiz = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.largeFontSize};
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  span {
    color: #e16d44;
  }
`
