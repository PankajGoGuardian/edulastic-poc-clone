import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { waitFor, render } from '@testing-library/react'
import { PremiumPopover } from '../PremiumPopover'

// #region mock child dependencies
jest.mock(
  '../../../author/src/components/common/PurchaseModals/index.js',
  () => () => 'PurchaseModals'
)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children, ...rest }) => (
    <a {...rest} href={to}>
      {children}
    </a>
  ),
}))
jest.mock(
  '../../../common/components/AuthorCompleteSignupButton/index.js',
  // only mocks the case when signup is complete
  () => (props) => props.renderButton(props.onClick)
)
// #endregion

describe('Testing PremiumPopover', () => {
  it('Test close button', async () => {
    const targetDiv = document.createElement('div')
    targetDiv.className = 'popup-container-div'
    document.body.appendChild(targetDiv)
    const state = { premiumPopup: targetDiv }
    const view = render(
      <>
        <div />
        <PremiumPopover
          target={state.premiumPopup}
          onClose={() => {
            state.premiumPopup = null
          }}
          descriptionType="bubble"
          // #region redux store props
          isPremiumUser={false}
          isPremiumTrialUsed={false}
          needsRenewal={false}
          products={[]}
          showHeaderTrialModal={false}
          itemBankSubscriptions={[]}
          usedTrialItemBankIds={[]}
          interestedSubjects={false}
          isCpm={false}
          isVerificationPending={false}
          setShowHeaderTrialModal={() => {}}
          startTrialAction={() => {}}
          // #endregion
        />
      </>
    )
    userEvent.click(view.getByText('x'))
    await waitFor(() => expect(state.premiumPopup).toBeNull())
  })

  it('Test no thanks', async () => {
    const targetDiv = document.createElement('div')
    targetDiv.className = 'popup-container-div'
    document.body.appendChild(targetDiv)
    const state = { premiumPopup: targetDiv }
    const view = render(
      <>
        <div />
        <PremiumPopover
          target={state.premiumPopup}
          onClose={() => {
            state.premiumPopup = null
          }}
          descriptionType="bubble"
          // #region redux store props
          isPremiumUser={false}
          isPremiumTrialUsed
          needsRenewal
          products={[]}
          showHeaderTrialModal={false}
          itemBankSubscriptions={[]}
          usedTrialItemBankIds={[]}
          interestedSubjects={false}
          isCpm={false}
          isVerificationPending={false}
          setShowHeaderTrialModal={() => {}}
          startTrialAction={() => {}}
          // #endregion
        />
      </>
    )
    userEvent.click(view.getByText('NO, THANKS'))
    await waitFor(() => expect(state.premiumPopup).toBeNull())
  })

  it('Test renew now', async () => {
    const targetDiv = document.createElement('div')
    targetDiv.className = 'popup-container-div'
    document.body.appendChild(targetDiv)
    const state = { premiumPopup: targetDiv }
    const view = render(
      <>
        <div />
        <PremiumPopover
          target={state.premiumPopup}
          onClose={() => {
            state.premiumPopup = null
          }}
          descriptionType="bubble"
          // #region redux store props
          isPremiumUser={false}
          isPremiumTrialUsed
          needsRenewal
          products={[]}
          showHeaderTrialModal={false}
          itemBankSubscriptions={[]}
          usedTrialItemBankIds={[]}
          interestedSubjects={false}
          isCpm={false}
          isVerificationPending={false}
          setShowHeaderTrialModal={() => {}}
          startTrialAction={() => {}}
          // #endregion
        />
      </>
    )
    expect(view.getByText('RENEW NOW')).toBeInTheDocument()
  })
})
