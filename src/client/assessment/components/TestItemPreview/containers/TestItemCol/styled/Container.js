import styled from 'styled-components'
import { mobileWidth } from '@edulastic/colors'

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-right-color: ${(props) =>
    props.theme.testItemPreview.itemColBorderColor};
  background-color: ${(props) => props.isStudentAttempt && '#fff'};
  border-radius: ${(props) => props.isStudentAttempt && '8px'};
  margin-top: ${(props) => props.isStudentAttempt && '8px'};
  min-height: ${(props) => props.isStudentAttempt && 'calc(100vh - 122px)'};
  max-height: ${(props) => props.isStudentAttempt && 'calc(100vh - 122px)'};
  overflow: ${(props) =>
    props.isStudentAttempt && !props.showScratchpad && 'auto'};

  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${(props) => !props.value && '20px'};
    margin-left: ${(props) => props.value && '20px'};
  }
`

export const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100%;
  position: relative;
`
