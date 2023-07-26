import { EduButton, FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'

export const OptionsContainer = styled.div`
  margin-top: 89px;
  margin-left: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`
export const EduButtonAI = styled(EduButton)`
  width: 20%;
`
export const CreateAiTestTitleWrapper = styled(TitleWrapper)`
  padding: 0;
  margin: 0;
  line-height: 2;
  color: #fff;
`

export const CreateAiTestWrapper = styled(FlexContainer)`
  border-radius: 10px;
  background: rgb(63, 132, 229);
  background: linear-gradient(
    90deg,
    rgba(63, 132, 229, 1) 40%,
    rgba(74, 172, 139, 1) 71%
  );
  width: calc(100% - 42px);
`
