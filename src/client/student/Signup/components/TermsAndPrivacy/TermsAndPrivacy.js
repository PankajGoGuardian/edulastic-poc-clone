import React from 'react'
import { TermsPrivacy } from '../../styled/index'

const TermsAndPrivacy = () => {
  return (
    <TermsPrivacy>
      By signing up, you agree to our{' '}
      <a
        href="https://edulastic.com/terms-of-service/"
        target="_blank"
        rel="noreferrer"
      >
        {' '}
        Terms{' '}
      </a>{' '}
      and{' '}
      <a
        href="https://edulastic.com/privacy-policy/"
        target="_blank"
        rel="noreferrer"
      >
        {' '}
        Privacy Policy
      </a>
      .
    </TermsPrivacy>
  )
}

export default TermsAndPrivacy
