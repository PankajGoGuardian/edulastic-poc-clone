import {
  CustomModalStyled,
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
} from '@edulastic/common'
import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { connect } from 'react-redux'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { Spin } from 'antd'
import { BodyContainer } from '../../ClassBoard/components/styled'
import {
  interventionsList,
  isInterventionsDataLoading,
} from '../../Reports/subPages/dataWarehouseReports/GoalsAndInterventions/ducks/selectors'
import {
  AssignedParagraph,
  CustomRow,
  RowsWrap,
  StandardsParagraph,
  TitleCopy,
} from './styled'
import { TUTOR_ME_APP_URL } from '../constants'
import ViewProgressLink from './ViewProgressLink'

const History = ({ intervention }) => {
  const {
    createdBy: { name = '-' },
  } = intervention
  const masteryDetailsByDomainId = groupBy(
    intervention.interventionCriteria.standardMasteryDetails,
    'domainId'
  )
  return (
    <div>
      <AssignedParagraph>
        {`Tutoring assigned by ${name} on ${formatDate(
          intervention.createdAt
        )}`}
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
  _interventionsList,
  isInterventionsLoading,
}) => {
  const fiveLatestInterventions = useMemo(
    () =>
      _interventionsList.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [_interventionsList]
  )
  return (
    <CustomModalStyled
      centered
      title="Tutoring Details"
      titleColor="#000"
      titleFontWeight={600}
      visible={open}
      onCancel={closePopup}
      borderRadius="20px"
      modalWidth="650px"
      padding="20px 30px"
      bodyPadding="8px 0"
      footer={null}
      destroyOnClose
      closable
    >
      <BodyContainer>
        <EduIf condition={isInterventionsLoading}>
          <EduThen>
            <Spin />
          </EduThen>
          <EduElse>
            <div style={{ fontSize: '12px', color: '#777777' }}>
              View tutoring history
              {_interventionsList.length > 5 && ' (limited to last 5)'}, copy
              link to share to students{' '}
            </div>
            <RowsWrap>
              {fiveLatestInterventions.map((intervention) => (
                <CustomRow>
                  <History intervention={intervention} />
                  <FlexContainer
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <TitleCopy
                      copyable={{
                        text: intervention.tutoringLink ?? TUTOR_ME_APP_URL,
                      }}
                    />
                    <ViewProgressLink data={intervention} />
                  </FlexContainer>
                </CustomRow>
              ))}
            </RowsWrap>
          </EduElse>
        </EduIf>
      </BodyContainer>
    </CustomModalStyled>
  )
}

export default connect((state) => ({
  _interventionsList: interventionsList(state),
  isInterventionsLoading: isInterventionsDataLoading(state),
}))(TutorDetails)
