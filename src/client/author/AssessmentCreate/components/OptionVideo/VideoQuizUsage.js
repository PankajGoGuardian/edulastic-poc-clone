import React, { useState } from 'react'
import styled from 'styled-components'
import { vqUsageProgressColor, white } from '@edulastic/colors'
import { IconInfoCircle, IconVQTextCheck, IconStar } from '@edulastic/icons'
import { withRouter } from 'react-router-dom'
import { Progress } from 'antd'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  vqQuotaForDistrictSelector,
  vqUsageCountSelector,
} from '../../../src/selectors/user'
import { navigationState } from '../../../src/constants/navigation'

const { red, green, orange, trailColor } = vqUsageProgressColor

const getVQTagBgColorForQuota = (remainingPercentage) => {
  switch (true) {
    case remainingPercentage <= 25:
      return red
    case remainingPercentage <= 50:
      return orange
    default:
      return green
  }
}

const VQ_UPGRADE_MESSAGE_LIST = [
  'Unlimited Video Quizzes',
  'Generate Questions using AI',
]

const VideoQuizUsage = ({ history, vqUsageCount, vqQuotaForDistrict }) => {
  const [isVisible, setIsModalOpen] = useState(false)

  if (vqUsageCount === 0) return null

  const remainingUsageForVq = vqQuotaForDistrict - vqUsageCount

  const remainingPercentage = (remainingUsageForVq / vqQuotaForDistrict) * 100

  const goToAddOnsPage = () => {
    history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.ADDON },
    })
  }

  return (
    <>
      <FlexContainer justifyContent="center" alignItems="center">
        <VQUsageProgress
          type="circle"
          strokeColor={getVQTagBgColorForQuota(remainingPercentage)}
          showInfo={false}
          strokeWidth={18}
          strokeLinecap="square"
          percent={100 - parseInt(remainingPercentage, 10)}
          width={16}
          trailColor={trailColor}
        />
        <VideoQuizUsageText>{`${vqUsageCount}/${Math.max(
          vqUsageCount,
          vqQuotaForDistrict
        )} Free Quizzes Used`}</VideoQuizUsageText>
        <span onClick={() => setIsModalOpen(true)}>
          <IconInfoCircle margin="6px 0 0 0" />
        </span>
        <CustomModalStyled
          visible={isVisible}
          onCancel={() => setIsModalOpen(false)}
          title="You’re on Free Plan"
          footer={null}
          destroyOnClose
          width="420px"
        >
          <FlexContainer justifyContent="space-between" flexDirection="column">
            <UpgradeAiSuitText paddingBottom="16px">
              What’s included?
            </UpgradeAiSuitText>
            <FlexContainer justifyContent="flex-start">
              <IconVQTextCheck margin="3px 0 0 0" />
              <UpgradeAiSuitText paddingBottom="16px" ml="5px">
                {vqQuotaForDistrict} Free Video Quizzes Included
              </UpgradeAiSuitText>
            </FlexContainer>
          </FlexContainer>
          <UpgradeToAiSuitBox>
            <FlexContainer justifyContent="space-between">
              <FlexContainer
                justifyContent="space-between"
                height="58px"
                flexDirection="column"
              >
                <UpgradeAiSuitTitle>
                  Upgrade to Premium Suite
                  <DollarSymbolWrapper>
                    <IconStar />
                  </DollarSymbolWrapper>
                </UpgradeAiSuitTitle>
                {VQ_UPGRADE_MESSAGE_LIST.map((message, index) => (
                  <FlexContainer justifyContent="flex-start" key={index}>
                    <IconVQTextCheck margin="3px 0 0 0" />
                    <UpgradeAiSuitText ml="5px">{message}</UpgradeAiSuitText>
                  </FlexContainer>
                ))}
              </FlexContainer>
              <FlexContainer alignItems="center">
                <UpgradeAiSuitButton isGhost onClick={goToAddOnsPage}>
                  Upgrade
                </UpgradeAiSuitButton>
              </FlexContainer>
            </FlexContainer>
          </UpgradeToAiSuitBox>
        </CustomModalStyled>
      </FlexContainer>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    vqQuotaForDistrict: vqQuotaForDistrictSelector(state),
    vqUsageCount: vqUsageCountSelector(state),
  }))
)
export default enhance(VideoQuizUsage)

const VideoQuizUsageText = styled.span`
  color: #3d3d3d;
  text-align: center;
  font-family: 'Open Sans';
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  margin: 0 5px;
`
const VQUsageProgress = styled(Progress)`
  line-height: 0;
`

const UpgradeToAiSuitBox = styled.div`
  border-radius: 8px;
  border: 1px solid #e36c0d;
  background: #fcf5eb;
  padding: 16px;
`

const UpgradeAiSuitTitle = styled(FlexContainer)`
  color: #000;
  font-family: 'Open Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
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
const UpgradeAiSuitButton = styled(EduButton)`
  font-weight: ${({ fontWeight }) => fontWeight};
  height: '32px';
  width: '90px';
  text-align: center;
  font-family: 'Open Sans';
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  text-transform: capitalize;
  &.ant-btn.ant-btn-primary {
    border: none;
    border-radius: 4px;
    background: linear-gradient(191deg, #e36c0d 8.11%, #f5cb9a 149.61%);
    border: 'none';
    color: ${white};
  }
  &:hover {
    &.ant-btn.ant-btn-primary {
      background: linear-gradient(191deg, #e36c0d 8.11%, #f5cb9a 149.61%);
      color: ${white};
      border: none;
    }
  }
`
const DollarSymbolWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${white};
  margin-left: 8px;
  width: 22px;
  text-align: center;
  border-radius: 2px;
`
