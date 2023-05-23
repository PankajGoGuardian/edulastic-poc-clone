import { EduButton } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import AuthorCompleteSignupButton from '../../../../../common/components/AuthorCompleteSignupButton'
import { slice } from '../../../../Subscription/ducks'

const ActionButton = ({ setShowHeaderTrialModal }) => {
  return (
    <ActionContainer>
      <AuthorCompleteSignupButton
        renderButton={(handleClick) => (
          <SecondaryButton height="30px" isGhost onClick={handleClick}>
            TAKE FREE TRIAL
          </SecondaryButton>
        )}
        onClick={() => setShowHeaderTrialModal(true)}
      />{' '}
      <Link to="/author/subscription">
        <PrimaryButton height="30px" isGhost>
          UPGRADE NOW
        </PrimaryButton>
      </Link>
    </ActionContainer>
  )
}

const ActionContainer = styled.div`
  text-align: right;

  button {
    display: inline;
  }
`
const SecondaryButton = styled(EduButton)`
  background: transparent !important;
  color: white !important;
  border-color: white !important;
`

const PrimaryButton = styled(EduButton)`
  border-color: white !important;
`

const enhance = connect(() => ({}), {
  setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
})

export default enhance(ActionButton)
