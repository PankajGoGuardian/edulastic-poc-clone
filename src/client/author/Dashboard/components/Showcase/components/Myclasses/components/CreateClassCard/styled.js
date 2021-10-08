import styled from 'styled-components'
import { greyThemeDark1, greyThemeLight } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'

export const CreateClassCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  max-width: 380px;
  height: 220px;
  border: 2px solid ${greyThemeLight};
  border-radius: 10px;
  border-style: dashed;
  margin-top: 20px;
  text-align: center;
  & > .ClassSyncActionButton > p {
    margin-left: 4px;
    & > svg {
      margin: unset;
    }
  }
`

export const CreateClassTitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: ${greyThemeDark1};
`
export const InfoText = styled.p`
  font-size: 13px;
  max-width: 270px;
  color: ${greyThemeDark1};
`
export const StyledEduButton = styled(EduButton)`
  width: 205px;
  justify-content: center;
  margin-bottom: 8px;
`

export const Text = styled.p``
