import React from 'react'
import styled from 'styled-components'

import { IconVQTextCheck, IconVQVideo } from '@edulastic/icons'

import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  vqQuotaForDistrictSelector,
  vqUsageCountSelector,
} from '../../../../src/selectors/user'
import VideoQuizUsage from '../../../../VideoLibrary/container/components/VideoQuizUsage'

const VideoQuizUsageBanner = ({ vqUsageCount, vqQuotaForDistrict }) => {
  const showUsageCount = vqUsageCount > 0
  return (
    <FlexContainer
      justifyContent={showUsageCount ? 'flex-start' : 'center'}
      alignItems="center"
      width={showUsageCount ? '90%' : '100%'}
      padding="16px 0"
    >
      <EduIf condition={showUsageCount}>
        <EduThen>
          <VideoQuizUsage />
        </EduThen>
        <EduElse>
          <UpgradeToAiSuitBox>
            <FlexContainer justifyContent="flex-start" alignItems="center">
              <VideoIconWrapper mr="16px">
                <IconVQVideo />
              </VideoIconWrapper>
              <FlexContainer
                flexDirection="column"
                height="50px"
                justifyContent="space-between"
              >
                <UpgradeAiSuitTitle>You’re on our Free Plan</UpgradeAiSuitTitle>
                <FlexContainer justifyContent="flex-start" alignItems="center">
                  <IconVQTextCheck margin="3px 0 0 0" />
                  <UpgradeAiSuitText ml="5px">
                    {vqQuotaForDistrict} Free Video Quizzes Included
                  </UpgradeAiSuitText>
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
          </UpgradeToAiSuitBox>
        </EduElse>
      </EduIf>
    </FlexContainer>
  )
}

const enhance = compose(
  connect((state) => ({
    vqQuotaForDistrict: vqQuotaForDistrictSelector(state),
    vqUsageCount: vqUsageCountSelector(state),
  }))
)
export default enhance(VideoQuizUsageBanner)

const UpgradeToAiSuitBox = styled.div`
  border-radius: 8px;
  border: 1px solid #e36c0d;
  background: #fcf5eb;
  padding: 16px;
  width: 90%;
  margin-bottom: 16px;
`
const UpgradeAiSuitTitle = styled.div`
  color: #000;
  font-family: 'Open Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
`
const UpgradeAiSuitText = styled(FlexContainer)`
  color: #3d3d3d;
  font-family: 'Open Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
  align-items: center;
  justify-content: flex-start;
  margin-left: ${({ ml }) => ml};
`

const VideoIconWrapper = styled(FlexContainer)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(181deg, #e36c0d 0.95%, #f5cb9a 99.11%);
  justify-content: center;
  align-items: center;
`
