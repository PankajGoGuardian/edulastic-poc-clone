import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import TrialModal from '../components/Showcase/components/Myclasses/components/TrialModal'

describe('Dashboard TrialModal', () => {
  test('test Trial Modal visibility', async () => {
    render(
      <TrialModal
        addOnProductIds={[
          '6026755405636529c4ff1d35',
          '612c77bfe7e33906e10447af',
        ]}
        isVisible
        toggleModal={() => {}}
        isPremiumUser={false}
        isPremiumTrialUsed={false}
        startPremiumTrial={() => {}}
        products={[
          {
            description:
              'Get even more out of your premium subscription by adding Spark premium content',
            id: '5f0835a1984cfa6bcef1e14d',
            name: 'Teacher Premium',
            period: 365,
            price: 100,
            trialPeriod: 14,
            type: 'PREMIUM',
          },
        ]}
        setShowHeaderTrialModal={() => {}}
        setShowTrialSubsConfirmation={() => {}}
        setTrialAddOnProductIds={() => {}}
        hasAllTrialProducts={false}
        setIsTabShouldSwitch={() => {}}
      />
    )
    const modalTitle = screen.getByText('Start Your Free Trial!')
    expect(modalTitle).toBeInTheDocument()
    const subTitle = screen.getByText(
      'Experience the additional features of Edulastic Teacher Premium for 14 days: read-loud for students, extra test security settings, easier collaboration, in-depth reports and more.'
    )
    expect(subTitle).toBeInTheDocument()
    const teacherPremiumTrialCheckbox = document.querySelector(
      '[data-cy="teacherPremiumTrialCheckbox"]'
    )
    expect(teacherPremiumTrialCheckbox).toBeInTheDocument()
    const creditCardText = screen.getByText('No credit card required now!')
    expect(creditCardText).toBeInTheDocument()
    const cancel = document.querySelector('[data-cy="cancelButton"]')
    expect(cancel).toBeInTheDocument()
    const Proceed = document.querySelector('[data-cy="proceedButton"]')
    expect(Proceed).toBeInTheDocument()
  })
})
