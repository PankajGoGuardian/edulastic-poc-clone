import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { Table } from 'antd'
import qs from 'qs'
import { connect } from 'react-redux'
import { get, isInteger, floor, isEmpty, orderBy, toUpper } from 'lodash'
import { PrintActionWrapper } from '@edulastic/common'
import Title from './Title'
import StudentCard from './StudentCard'
import {
  PrintPreviewBack,
  PrintPreviewContainer,
  ParagraphDiv,
  BoldText,
  ClassInfo,
  ClassName,
  ClassCode,
  Description,
  CardContainer,
} from './styled'

import { fetchStudentsByIdAction } from '../../ducks'

const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    width: '25%',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    width: '25%',
  },
  {
    title: 'User Name',
    dataIndex: 'email',
    width: '50%',
  },
]

const numOfCard = 6

const rowKey = ({ _id }) => _id

class PrintPreviewClass extends React.Component {
  static propTypes = {
    selctedClass: PropTypes.object.isRequired,
    students: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { match, loadStudents } = this.props
    const { classId } = match.params
    loadStudents({ classId })
  }

  render() {
    const appLoginUrl = `${window.location.origin}/login`
    const { selctedClass, students, location, user } = this.props
    const query = qs.parse(location.search, { ignoreQueryPrefix: true })
    const { studentIds } = query
    const selectedStudent =
      studentIds && students
        ? students.filter((s) => studentIds.includes(s._id))
        : []
    const { code, name: className, owners = [] } = selctedClass
    let teacherName = owners[0]?.name

    if (!teacherName && owners[0]?.id === user._id) {
      const { firstName, lastName } = user
      teacherName = [firstName, lastName].filter((n) => n).join(' ')
    }

    let tableData = selectedStudent
    if (isEmpty(tableData)) {
      tableData = students?.filter(
        (student) => student.enrollmentStatus === 1 && student.status === 1
      )
    }
    // sort the data same as manage class student table
    tableData = orderBy(
      tableData,
      [(data) => toUpper(data?.lastName || '')],
      ['asc']
    )
    let pages = tableData?.length / numOfCard
    if (!isInteger(pages)) {
      pages = floor(pages + 1)
    }
    pages = [...Array(pages).keys()]

    return (
      <>
        <PrintActionWrapper />
        <PrintPreviewBack>
          <PrintPreviewContainer height="auto">
            <Title />
            <ParagraphDiv>
              <BoldText>{`Congratulations ${teacherName} - your class roster is now ready for class ${className}.`}</BoldText>
            </ParagraphDiv>

            <ParagraphDiv>
              <ClassInfo>
                <BoldText>Class Name: </BoldText>{' '}
                <ClassName>{className}</ClassName>
              </ClassInfo>
              <ClassInfo>
                <BoldText>Class Code: </BoldText> <ClassCode>{code}</ClassCode>
              </ClassInfo>
            </ParagraphDiv>

            <Description>
              Please ask the student to navigate to{' '}
              <a href={appLoginUrl}>{appLoginUrl}</a>. The default password for
              all students is set to the class code. Please ask the student to
              log in using the username below and enter the password as{' '}
              <ClassCode>{code}</ClassCode>.
            </Description>

            <Table
              columns={columns}
              bordered
              dataSource={tableData}
              rowKey={rowKey}
              pagination={false}
            />
          </PrintPreviewContainer>

          {pages.map((p, i) => (
            <PrintPreviewContainer key={i}>
              <CardContainer>
                {!!tableData &&
                  tableData
                    .slice(i * numOfCard, i * numOfCard + numOfCard)
                    .map((student, index) => (
                      <StudentCard
                        student={student}
                        key={index}
                        code={code}
                        appLoginUrl={appLoginUrl}
                      />
                    ))}
              </CardContainer>
            </PrintPreviewContainer>
          ))}
        </PrintPreviewBack>
      </>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      students: get(state, 'manageClass.studentsList', []),
      selctedClass: get(state, 'manageClass.entity'),
      user: get(state, 'user.user'),
    }),
    {
      loadStudents: fetchStudentsByIdAction,
    }
  )
)(PrintPreviewClass)
