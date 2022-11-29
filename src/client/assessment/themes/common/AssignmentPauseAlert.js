import React from 'react'
import { Card, EduButton } from '@edulastic/common'
import { Overlay } from '../../styled/Overlay'

export const AssignmentPauseAlert = ({ backToHomePage }) => {
  return (
    <Overlay>
      <Card title="Assignment Paused Alert">
        <p>
          Your teacher has paused the assignment. Please contact your teacher to
          resume the assignment
        </p>
        <EduButton onClick={backToHomePage}>Move to home screen</EduButton>
      </Card>
    </Overlay>
  )
}
