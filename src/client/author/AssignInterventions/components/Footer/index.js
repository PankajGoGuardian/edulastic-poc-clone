import React from 'react'
import { EduButton } from '@edulastic/common'
import { keyBy, omit } from 'lodash'
import {
  IconAssignPearPractice,
  IconAssignPearDeckTutor,
} from '@edulastic/icons'
import { ButtonContainer, FooterContainer } from './style'

const Footer = ({ selectedStudents, studentListWithStandards }) => {
  const printStudentDetails = () => {
    const studentListWithStandardsById = keyBy(studentListWithStandards, '_id')
    return selectedStudents.map((studentId) => {
      const studentInfo = studentListWithStandardsById[studentId]
      return omit(studentInfo, ['fakeFirstName', 'fakeLastName', 'icon'])
    })
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
