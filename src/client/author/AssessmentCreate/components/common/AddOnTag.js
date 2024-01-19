import React from 'react'

import styled from 'styled-components'
import {
  green,
  mainTextColor,
  orange,
  premiumBg,
  red,
  white,
  yellow,
} from '@edulastic/colors'
import { IconStar } from '@edulastic/icons'
import { withRouter } from 'react-router-dom'
import { Popover, Tag } from 'antd'
import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { navigationState } from '../../../src/constants/navigation'

const getVQTagBgColorForQuota = ({ remaining, total }) => {
  if (remaining === 0 || total === 0) return red

  const percentage = (remaining / total) * 100

  switch (true) {
    case percentage <= 25:
      return red
    case percentage <= 50:
      return orange
    case percentage <= 75:
      return yellow
    default:
      return green
  }
}

const AddOnTag = ({
  isVideoQuiz,
  history,
  margin,
  message,
  component,
  remainingUsageForVq,
  vqQuotaForDistrict,
  isPremiumUser,
}) => {
  const goToAddOnsPage = () => {
    history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.ADDON },
    })
  }

  const hoverContent = (
    <FlexContainer flexDirection="column">
      <DollarSymbolWrapperWithText>
        <IconStar /> <AddOnTextWrapper>ADD-ON</AddOnTextWrapper>
      </DollarSymbolWrapperWithText>
      <AddonLabel>{message}</AddonLabel>
    </FlexContainer>
  )

  const addOnTagColor = getVQTagBgColorForQuota({
    remaining: remainingUsageForVq,
    total: vqQuotaForDistrict,
  })

  return (
    <EduIf condition={!component}>
      <EduThen>
        <EduIf
          condition={remainingUsageForVq === 0 && isVideoQuiz && isPremiumUser}
        >
          <EduThen>
            <Popover placement="top" trigger="hover" content={hoverContent}>
              <Link
                margin={margin}
                onClick={goToAddOnsPage}
                isVideoQuiz={isVideoQuiz}
              >
                <Tag color={addOnTagColor}>{remainingUsageForVq}</Tag>
              </Link>
            </Popover>
          </EduThen>
          <EduElse>
            <EduIf
              condition={isVideoQuiz && isPremiumUser && remainingUsageForVq}
            >
              <EduThen>
                <Popover
                  placement="top"
                  trigger="hover"
                  content="Shows Remaining Video Quiz"
                >
                  <Tag color={addOnTagColor}>{remainingUsageForVq}</Tag>
                </Popover>
              </EduThen>
              <EduElse>
                <Popover placement="top" trigger="hover" content={hoverContent}>
                  <Link
                    margin={margin}
                    onClick={goToAddOnsPage}
                    isVideoQuiz={isVideoQuiz}
                  >
                    <DollarSymbolWrapper>
                      <IconStar />
                    </DollarSymbolWrapper>
                  </Link>
                </Popover>
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </EduThen>
      <EduElse>
        <Popover placement="top" trigger="hover" content={hoverContent}>
          <span>{component}</span>
        </Popover>
      </EduElse>
    </EduIf>
  )
}

export default withRouter(AddOnTag)

const DollarSymbolWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${white};
  background-color: ${({ backgroundColor }) => backgroundColor || premiumBg};
  margin-right: 1rem;
  width: 22px;
  text-align: center;
  border-radius: 2px;
`
const DollarSymbolWrapperWithText = styled(DollarSymbolWrapper)`
  background: ${premiumBg};
  padding-left: 5px;
  width: max-content;
`
const Link = styled.a`
  position: relative;
  margin: ${({ margin }) => margin};
`
const AddOnTextWrapper = styled.p`
  font-weight: bolder;
  font-size: 11px;
  padding-right: 1rem;
`
const AddonLabel = styled.p`
  color: ${mainTextColor};
  margin-top: 5px;
  font-size: 11px;
`
