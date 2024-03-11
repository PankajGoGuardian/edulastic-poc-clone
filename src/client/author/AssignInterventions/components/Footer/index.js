import React from 'react'
import { EduButton } from '@edulastic/common'
import {
  IconAssignPearPractice,
  IconAssignPearDeckTutor,
} from '@edulastic/icons'
import { ButtonContainer, FooterContainer } from './style'

const Footer = ({ selectedStudents, studentListWithStandards }) => {
  const printStudentDetails = () => {
    return selectedStudents.map((studentId) => ({
      ...studentListWithStandards.find((student) => student._id === studentId),
    }))
  }
  return (
    <FooterContainer>
      <ButtonContainer>
        <EduButton
          disabled={selectedStudents.length === 0}
          onClick={() =>
            console.log('Assign Pear Practice', printStudentDetails())
          }
        >
          <IconAssignPearPractice />
          Assign Pear Practice
        </EduButton>
        <EduButton
          disabled={selectedStudents.length != 1}
          onClick={() =>
            console.log('Assign Pear Deck Tutor', printStudentDetails())
          }
        >
          <IconAssignPearDeckTutor />
          Assign Pear Deck Tutor
        </EduButton>
      </ButtonContainer>
    </FooterContainer>
  )
}

export default Footer
