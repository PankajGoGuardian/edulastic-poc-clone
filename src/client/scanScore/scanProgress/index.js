import { EduButton, FlexContainer } from '@edulastic/common'
import React, { useState, useEffect } from 'react'
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
import useRealtimeV2 from '@edulastic/common/src/customHooks/useRealtimeV2'
import PageLayout from '../uploadAnswerSheets/PageLayout'

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

const ScanProgress = ({ history, tempScannedDocs }) => {
  const totalLength = tempScannedDocs.length
  const [successCount, setSuccessCount] = useState(0)
  const [failureCount, setFailureCount] = useState(0)
  const processedCount = successCount + failureCount
  const percentFinished = round((processedCount / totalLength) * 100, 2)
  const { sessionId, groupId, assignmentId } = qs.parse(
    window.location.search.replace('?', '') || ''
  )

  useRealtimeV2([`session:${sessionId}:classId:${groupId}`], {
    webCamScanScore: (d) => {
      if (d.statusCode == 200) {
        setSuccessCount((c) => c + 1)
      } else {
        setFailureCount((c) => c + 1)
      }
    },
  })

  useEffect(() => {
    if (totalLength == processedCount) {
      history.push({
        pathname: '/uploadAnswerSheets',
        search: `assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}`,
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
    } else {
      console.log('useFeect', {
        assignmentId,
        groupId,
        sessionId,
        tempScannedDocs,
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
      title: 'Upload Responses',
      to: `/uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}`,
    },
  ]

  return (
    <PageLayout
      assignmentTitle="Scan Student Responses"
      classTitle="Class Name"
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
        <StyledTitle>Processing Responses...</StyledTitle>
        <Progress
          strokeColor={themeColorBlue}
          percent={percentFinished}
          status="active"
          showInfo={false}
        />
        <br />
        <Details
          label="Responses Processed"
          value={successCount + failureCount}
        />
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
