import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import StudentDetails from '../components/StudentDetails'

const studentInformation = {
  studentId: 'studentId',
  firstName: 'firstName',
  lastName: 'lastName',
  schoolName: ' schoolName',
  groupId: 'groupId',
  subject: 'subject',
  grades: '1',
  courseName: 'courseName',
  courseId: 'courseId',
  standardSet: 'standardSet',
  termId: 'termId',
}

describe('Data warehouse reports ', () => {
  test('student details component visibility ', async () => {
    render(<StudentDetails studentInformation={studentInformation} />)
    const userIcon = screen.getByTestId('userIcon')
    expect(userIcon).toBeInTheDocument()
    const studentName = screen.getByTestId('studentName')
    expect(studentName).toBeInTheDocument()
    const schoolTitle = screen.getByText('School :')
    expect(schoolTitle).toBeInTheDocument()
    expect(screen.getByTestId('schoolName')).toBeInTheDocument()
    const gradeTitle = screen.getByText('Grade :')
    expect(gradeTitle).toBeInTheDocument()
    expect(screen.getByTestId('grade')).toBeInTheDocument()
    const raceTitle = screen.getByText('Race :')
    expect(raceTitle).toBeInTheDocument()
    expect(screen.getByTestId('race')).toBeInTheDocument()
    const genderTitle = screen.getByText('Gender :')
    expect(genderTitle).toBeInTheDocument()
    expect(screen.getByTestId('gender')).toBeInTheDocument()
    expect(screen.getByText('FRL Status')).toBeInTheDocument()
    expect(screen.getByText('IEP Status')).toBeInTheDocument()
    expect(screen.getByText('ELL Status')).toBeInTheDocument()
    expect(screen.getByText('Hispanic Ethnicity')).toBeInTheDocument()
  })
})
