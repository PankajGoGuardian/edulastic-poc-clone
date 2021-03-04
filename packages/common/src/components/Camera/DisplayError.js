import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconCameraBlocked } from '@edulastic/icons'

const DisplayErrorStyled = styled.div`
  width: 100%;
  margin: 0 auto;
  color: black;
  background-color: white;
`

const ErrorHeading = styled.h1`
  font-weight: bold;
`

const ErrorHeadingSecondary = styled.h3`
  font-weight: bold;
`

const ErrorDescription = styled.ul`
  text-align: left;
  padding-left: 20px;
`
export const DisplayError = ({ errorMsg }) => {
  const isErrorVisible = errorMsg && errorMsg.length > 0

  return (
    <>
      {isErrorVisible && (
        <DisplayErrorStyled>
          <ErrorHeading>Your Camera is blocked</ErrorHeading>
          <ErrorHeadingSecondary>
            Edulastic needs the access to camera. To use Show your work
          </ErrorHeadingSecondary>
          <ErrorDescription>
            <li>
              Click on camera block icon{' '}
              <IconCameraBlocked margin="5px 0 -5px 0" /> in your browser&apos;s
              address bar
            </li>
            <li>Allow access and refresh the page</li>
          </ErrorDescription>
        </DisplayErrorStyled>
      )}
    </>
  )
}

DisplayError.propTypes = {
  errorMsg: PropTypes.string,
}

DisplayError.defaultProps = {
  errorMsg: '',
}

export default DisplayError
