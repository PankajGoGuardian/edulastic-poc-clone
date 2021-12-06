import React from 'react'
import COPPADISCLOSURE from './COPPADisclosure.pdf'
import { TermsPrivacy } from '../../styled/index'

const TermsAndPrivacy = ({ signIn }) => {
  return signIn ? (
    <TermsPrivacy>
      By signing in you agree to our{' '}
      <a
        href="https://edulastic.com/terms-of-service/"
        target="_blank"
        rel="noreferrer"
      >
        Product Terms of Service & End User License Agreement
      </a>{' '}
      and{' '}
      <a
        href="https://edulastic.com/privacy-policy/"
        target="_blank"
        rel="noreferrer"
      >
        Product Privacy Policy
      </a>
    </TermsPrivacy>
  ) : (
    <>
      <TermsPrivacy align="left">By signing up:</TermsPrivacy>
      <TermsPrivacy align="left">
        1. You are agreeing to our{' '}
        <a
          href="https://edulastic.com/terms-of-service/"
          target="_blank"
          rel="noreferrer"
        >
          Product Terms of Service & End User License Agreement
        </a>{' '}
        and
        <a
          href="https://edulastic.com/privacy-policy/"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          Product Privacy Policy
        </a>
        ; AND
      </TermsPrivacy>
      <TermsPrivacy align="left" minWidth="330px">
        2. You are agreeing that you are authorized to act for your school and
        you consent to Edulastic's collection of student data in the{' '}
        <a
          onClick={() => window.open(COPPADISCLOSURE)}
          target="_blank"
          rel="noreferrer"
        >
          COPPA Disclosure
        </a>
      </TermsPrivacy>
    </>
  )
}

export default TermsAndPrivacy
