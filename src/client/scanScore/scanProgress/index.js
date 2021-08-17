import { EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PageLayout from '../uploadAnswerSheets/PageLayout'
import styled from 'styled-components'
import {
  fieldRequiredColor,
  themeColor,
  themeColorHoverBlue,
  textBlackColor,
} from '@edulastic/colors'

const dummyCallback = () => {}

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

const ScanProgress = ({
  history,
  assignmentId,
  groupId,
  successCount = 28,
  failureCount = 2,
}) => {
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

  const handleSuccessViewClick = successCount
    ? () => {
        console.log('Success')
      }
    : dummyCallback

  const handleFailureViewClick = failureCount
    ? () => {
        console.log('Success')
      }
    : dummyCallback

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
        <br />
        <Details
          label="Responses Processed"
          value={successCount + failureCount}
        />
        <Details
          label="Success"
          value={successCount}
          onViewClick={handleSuccessViewClick}
        />
        <Details
          label="Failed"
          value={failureCount}
          onViewClick={handleFailureViewClick}
          isFailedDetails
        />
        <br />
        <br />
        <p>Successfully processed responses have been recorded on Edulastic.</p>

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

export default withRouter(ScanProgress)

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
