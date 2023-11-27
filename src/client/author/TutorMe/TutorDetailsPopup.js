import { CustomModalStyled } from '@edulastic/common'
import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { connect } from 'react-redux'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { interventionsByStudentIdSelector } from '../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/selectors'
import { BodyContainer } from '../ClassBoard/components/styled'
import { disabledAddStudentsList } from '../ClassBoard/ducks'
import {
  AssignedParagraph,
  CustomRow,
  RowsWrap,
  StandardsParagraph,
  TitleCopy,
} from './styled'
import { TUTOR_ME_APP_URL } from './constants'

const History = ({ intervention }) => {
  const masteryDetailsByDomainId = groupBy(
    intervention.interventionCriteria.standardMasteryDetails,
    'domainId'
  )
  return (
    <div>
      <AssignedParagraph>
        Tutoring Assigned: {formatDate(intervention.createdAt)}
      </AssignedParagraph>
      <StandardsParagraph>
        {Object.keys(masteryDetailsByDomainId).map((domainId) => {
          const groupedItems = masteryDetailsByDomainId[domainId]
          const identifiers = groupedItems.map(
            (item) => item.standardIdentifier
          )
          const domainDesc = groupedItems[0].domainDesc
          return (
            <>
              {domainDesc}: {identifiers.join(', ')}
              <br />
            </>
          )
        })}
      </StandardsParagraph>
    </div>
  )
}

const TutorDetails = ({
  closePopup,
  open,
  selectedStudent,
  interventionsByStudentId,
}) => {
  const selectedInterventions =
    interventionsByStudentId[selectedStudent.studentId] || []
  const fiveLatestInterventions = useMemo(
    () =>
      selectedInterventions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    [selectedInterventions]
  )
  return (
    <CustomModalStyled
      centered
      title="Tutoring Details"
      visible={open}
      onCancel={closePopup}
      borderRadius="20px"
      modalWidth="450px"
      padding="20px 30px"
      bodyPadding="8px 0"
      footer={null}
      destroyOnClose
    >
      <BodyContainer>
        <div style={{ fontSize: '14px', color: '#777' }}>
          View tutoring history
          {selectedInterventions.length > 5 && ' (limited to last 5)'}, copy
          link to share to students{' '}
        </div>
        <RowsWrap>
          {fiveLatestInterventions.map((intervention) => (
            <CustomRow>
              <History intervention={intervention} />
              <TitleCopy copyable={{ text: TUTOR_ME_APP_URL }} />
            </CustomRow>
          ))}
        </RowsWrap>
      </BodyContainer>
    </CustomModalStyled>
  )
}

export default connect((state) => ({
  disabledList: disabledAddStudentsList(state),
  interventionsByStudentId: interventionsByStudentIdSelector(state),
}))(TutorDetails)
