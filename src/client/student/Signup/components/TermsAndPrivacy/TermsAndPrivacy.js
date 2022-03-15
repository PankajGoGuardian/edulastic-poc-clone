import React from 'react'
import COPPADISCLOSURE from './COPPADisclosure.pdf'
import { TermsPrivacy } from '../../styled/index'

const TermsAndPrivacy = ({ signIn }) => {
  return (
    !signIn && (
      <TermsPrivacy align="left" minWidth="330px">
        By signing up, you are agreeing that you are authorized to act for your
        school and you consent to Edulastic&apos;s collection of student data in
        the{' '}
        <a
          onClick={() => window.open(COPPADISCLOSURE)}
          target="_blank"
          rel="noreferrer"
        >
          COPPA Disclosure.
        </a>
      </TermsPrivacy>
    )
  )
}

export default TermsAndPrivacy
