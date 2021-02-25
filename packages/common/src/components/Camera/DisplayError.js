import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const DisplayErrorStyled = styled.div`
  width: 100%;
  margin: 0 auto;
  color: black;
  background-color: white;
`
export const DisplayError = ({ errorMsg }) => {
  const isErrorVisible = errorMsg && errorMsg.length > 0

  return (
    <>
      {isErrorVisible && (
        <DisplayErrorStyled>
          <h1>Camera error: {errorMsg}</h1>
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
