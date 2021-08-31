import { EduButton, FlexContainer, FireBaseService } from '@edulastic/common'
import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Progress } from 'antd'
import { round } from 'lodash'
import {
  fieldRequiredColor,
  themeColor,
  themeColorHoverBlue,
  textBlackColor,
  themeColorBlue,
} from '@edulastic/colors'
import { scannerApi } from '@edulastic/api'
import { connect } from 'react-redux'
import qs from 'qs'
import PageLayout from '../uploadAnswerSheets/PageLayout'
import { selector } from '../uploadAnswerSheets/ducks'

const Details = ({ label, value, onViewClick, isFailedDetails }) => (
  <FlexContainer marginTop="10px" alignItems="center" width="100%">
    <FlexContainer
      width="340px"
      height="30px"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Label>{label}</Label>
      {onViewClick && (
        <StyledLink height="30px" onClick={onViewClick}>
          View
        </StyledLink>
      )}
    </FlexContainer>
    <Value isFailedDetails={isFailedDetails}>{value}</Value>
  </FlexContainer>
)
const collectionName = 'WebCamOmrUploadProgress'
const ScanProgress = ({
  history,
  tempScannedDocs,
  assignmentTitle,
  classTitle,
}) => {
  const { sessionId, groupId, assignmentId } = qs.parse(
    window.location.search.replace('?', '') || ''
  )

  const totalLength = tempScannedDocs.length
  const sessionProgress = FireBaseService.useFirestoreRealtimeDocument(
    (db) => db.collection(collectionName).doc(sessionId),
    [sessionId]
  )
  const { success: successCount = 0, failure: failureCount = 0 } =
    sessionProgress || {}

  const processedCount = successCount + failureCount
  const percentFinished = 10 + round((processedCount / totalLength) * 90, 2)

  useEffect(() => {
    if (totalLength == processedCount) {
      history.push({
        pathname: '/uploadAnswerSheets',
        search: `assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}&done=1`,
      })
    }
  }, [totalLength, processedCount])

  useEffect(() => {
    if (tempScannedDocs.length && assignmentId && groupId && sessionId) {
      scannerApi
        .scoreWebCamScans({
          assignmentId,
          groupId,
          sessionId,
          responses: tempScannedDocs.map(
            ({ imageUri, studentId, answers }) => ({
              answers,
              studentId,
              imageUri,
            })
          ),
        })
        .then((r) => {
          console.log('r', r)
        })
        .catch((e) => {
          console.warn('errr', e)
        })
    }
  }, [assignmentId, groupId, sessionId])

  const handleUploadAgain = () =>
    history.push({
      pathname: '/uploadAnswerSheets',
      search: window.location.search,
    })

  const breadcrumbData = [
    {
      title: 'Scan Bubble Sheet',
      to: `/uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}`,
    },
    {
      title: 'Scan Summary',
    },
  ]

  return (
    <PageLayout
      assignmentTitle={assignmentTitle}
      classTitle={classTitle}
      breadcrumbData={breadcrumbData}
      isScanProgressScreen
    >
      <FlexContainer
        width="600px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginLeft="auto"
        mr="auto"
      >
        <StyledTitle>Processing Forms...</StyledTitle>
        <Progress
          strokeColor={themeColorBlue}
          percent={percentFinished}
          status="active"
          showInfo={false}
        />
        <br />
        <Details label="Forms Processed" value={successCount + failureCount} />
        <Details label="Success" value={successCount} />
        <Details label="Failed" value={failureCount} isFailedDetails />
        <br />
        <br />

        <FlexContainer width="450px" mt="50px" justifyContent="space-evenly">
          <EduButton width="170px" onClick={handleUploadAgain} isGhost>
            UPLOAD AGAIN
          </EduButton>
          <EduButton width="170px">VIEW LIVE CLASS BOARD</EduButton>
        </FlexContainer>
      </FlexContainer>
    </PageLayout>
  )
}

export default connect(
  (state) => ({
    ...selector(state),
    tempScannedDocs:
      state?.scanStore?.uploadAnswerSheets?.webCamScannedDocs || [],
  }),
  {}
)(withRouter(ScanProgress))

const Label = styled.label`
  display: block;
  text-align: left;
  font: normal normal 700 12px/26px Open Sans;
  letter-spacing: 0px;
  color: ${textBlackColor};
  text-transform: uppercase;
`

const StyledTitle = styled.h2`
  font-weight: 700;
`

const Value = styled.label`
  text-align: center;
  font: normal normal 700 14px/26px Open Sans;
  letter-spacing: 0px;
  color: ${({ isFailedDetails }) =>
    isFailedDetails ? fieldRequiredColor : textBlackColor};
`

const StyledLink = styled.div`
  color: ${themeColor};
  text-transform: uppercase;
  font: normal normal 700 11px/21px Open Sans;
  cursor: pointer;
  padding: 0 15px;

  &:hover {
    color: ${themeColorHoverBlue};
  }
`
