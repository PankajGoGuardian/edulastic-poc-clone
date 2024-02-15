import React from 'react'
import i18 from '@edulastic/localization'
import { EduButton } from '@edulastic/common'
import { StyledAlertModal } from './styled-components'
import { ButtonsContainer } from '../../styled'
import { navigationState } from '../../../author/src/constants/navigation'

const BuyAISuiteAlertModal = ({
  isVisible,
  isClosable,
  stayOnSamePage,
  setAISuiteAlertModalVisibility,
  history,
  key,
}) => {
  const handleCancel = () => {
    if (
      stayOnSamePage &&
      typeof setAISuiteAlertModalVisibility === 'function'
    ) {
      setAISuiteAlertModalVisibility(false)
      return
    }
    history.push({
      pathname: '/author/tests',
    })
  }

  const handleBuyNow = () => {
    history.push({
      pathname: '/author/subscription',
      state: { view: navigationState.SUBSCRIPTION.view.ADDON },
    })
  }

  return (
    <StyledAlertModal
      key={`${key}-addon-alert`}
      modalWidth="500px"
      visible={isVisible}
      centered
      destroyOnClose
      maskClosable={isClosable}
      isClosable={isClosable}
      onCancel={handleCancel}
      footer={[
        <ButtonsContainer>
          <EduButton isGhost onClick={handleCancel}>
            Cancel
          </EduButton>
          <EduButton onClick={handleBuyNow}>Buy now</EduButton>
        </ButtonsContainer>,
      ]}
    >
      {i18.t('author:aiSuite.addOnText')}
    </StyledAlertModal>
  )
}

export default BuyAISuiteAlertModal
