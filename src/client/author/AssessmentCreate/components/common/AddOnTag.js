import React from 'react'

import styled from 'styled-components'
import { mainTextColor, premiumBg, white } from '@edulastic/colors'
import { IconStar } from '@edulastic/icons'
import { withRouter } from 'react-router-dom'
import { Popover } from 'antd'
import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { navigationState } from '../../../src/constants/navigation'

const AddOnTag = ({ history, margin, message, component }) => {
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

  return (
    <EduIf condition={!component}>
      <EduThen>
        <Popover placement="top" trigger="hover" content={hoverContent}>
          <Link margin={margin} onClick={goToAddOnsPage}>
            <DollarSymbolWrapper>
              <IconStar />
            </DollarSymbolWrapper>
          </Link>
        </Popover>
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
