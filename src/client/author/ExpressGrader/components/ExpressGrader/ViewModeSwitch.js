import React from 'react'
import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import { fadedGrey, themeColorBlue, white, lightGrey2 } from '@edulastic/colors'
import { SwitchLabel } from './styled'

const ViewModeSwitch = ({ scoreMode, toggleScoreMode }) => (
  <Container data-cy="response-toggle" alignItems="center" mr="36px">
    <SwitchLabel>View Mode</SwitchLabel>
    <SwitchButton
      left
      actived={scoreMode}
      onClick={!scoreMode && toggleScoreMode}
    >
      Score
    </SwitchButton>
    <SwitchButton actived={!scoreMode} onClick={scoreMode && toggleScoreMode}>
      Response
    </SwitchButton>
  </Container>
)

export default ViewModeSwitch

const Container = styled(FlexContainer)`
  font-size: 9px;
  font-weight: 600;
`
const SwitchButton = styled.div`
  width: 65px;
  text-transform: uppercase;
  cursor: pointer;
  margin-left: ${({ left }) => left && '24px'};
  background: ${({ actived }) => (actived ? themeColorBlue : fadedGrey)};
  color: ${({ actived }) => (actived ? white : lightGrey2)};
  padding: ${({ left }) => (left ? '6px 20px' : '6px 10px')};
  border-radius: ${({ left }) =>
    left ? '4px 0px 0px 4px' : '0px 4px 4px 0px'};
`
